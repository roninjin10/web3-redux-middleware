'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPromiEvent = isPromiEvent;
function isPromiEvent(value) {
  return value !== null && typeof value === 'object' && value && typeof value.then === 'function' && typeof value.on === 'function';
}