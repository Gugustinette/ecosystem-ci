import { downloadTemplate } from 'giget'

/**
 * Clone a GitHub repository to a destination folder
 * @param url url of the repository to clone
 * @param destination destination folder
 */
export async function cloneRepo(
  url: string,
  destination: string,
): Promise<void> {
  await downloadTemplate(url, {
    dir: destination,
  })
}
