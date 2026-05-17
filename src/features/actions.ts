import { execSync, type ExecException } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import type { PackageAction } from "../options/types";

export async function runPackageActions(
  packageName: string,
  pkgDir: string,
  actions: PackageAction[] = [],
): Promise<void> {
  console.info(`Running actions for package ${packageName}...`);
  // Since pnpm v11, pnpm will resolve workspace packages by searching up the directory tree.
  // To prevent actions from accidentally running pnpm commands that resolve to a parent workspace,
  // we create a temporary pnpm workspace boundary if any pnpm commands are detected in the actions.
  const cleanupPnpmWorkspaceBoundary = ensurePnpmWorkspaceBoundary(pkgDir, actions);

  try {
    for (const action of actions) {
      if (typeof action === "string") {
        console.info(`  Executing action: ${action}`);
        try {
          execSync(action, {
            cwd: pkgDir,
            env: {
              ...process.env,
            },
            stdio: "pipe",
          });
        } catch (error) {
          throw buildActionError(error as ExecException, action, packageName);
        }
      } else {
        const name = action.name || "anonymous function";
        console.info(`  Executing action: [function ${name}]`);
        await Promise.resolve(action());
      }
    }
  } finally {
    cleanupPnpmWorkspaceBoundary();
  }
}

function ensurePnpmWorkspaceBoundary(pkgDir: string, actions: PackageAction[]): () => void {
  const hasPnpmAction = actions.some(
    (action) => typeof action === "string" && /^pnpm(\s|$)/.test(action.trim()),
  );

  if (!hasPnpmAction) {
    return () => {};
  }

  const workspaceFilePath = path.join(pkgDir, "pnpm-workspace.yaml");
  if (fs.existsSync(workspaceFilePath)) {
    return () => {};
  }

  // Create temporary pnpm workspace file
  fs.writeFileSync(workspaceFilePath, "packages:\n  - .\n", "utf8");

  // Return cleanup function to remove the temporary workspace file
  return () => {
    if (fs.existsSync(workspaceFilePath)) {
      fs.rmSync(workspaceFilePath, { force: true });
    }
  };
}

function buildActionError(execError: ExecException, action: string, packageName: string): Error {
  const stdout = execError.stdout ? execError.stdout.toString().trimEnd() : "";
  const stderr = execError.stderr ? execError.stderr.toString().trimEnd() : "";
  const message = [
    `Failed to execute action "${action}" for package ${packageName}.`,
    stderr && `stderr:\n${stderr}`,
    stdout && `stdout:\n${stdout}`,
    !stdout && !stderr && execError.message,
  ]
    .filter(Boolean)
    .join("\n");

  return new Error(message);
}
