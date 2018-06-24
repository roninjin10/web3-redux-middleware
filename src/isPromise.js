export function isPromise(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    value &&
    typeof value.then === 'function'
  )
}