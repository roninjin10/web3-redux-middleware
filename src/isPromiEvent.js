export function isPromiEvent(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    value &&
    typeof value.then === 'function' &&
    typeof value.on === 'function'
  )
}