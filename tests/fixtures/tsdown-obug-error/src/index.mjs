import obug from 'obug-npm'

export default function Debug(...options) {
  throw new Error('Intentional failure from obug package')
  return obug(...options)
}
