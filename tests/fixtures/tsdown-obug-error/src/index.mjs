import obug from 'obug'

export default function Debug(...options) {
  throw new Error('Intentional failure from obug package')
  return obug(...options)
}
