'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPromise = isPromise;
function isPromise(value) {
  return value !== null && typeof value === 'object' && value && typeof value.then === 'function';
}