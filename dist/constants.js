'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const PENDING = exports.PENDING = 'PENDING';
const FULFILLED = exports.FULFILLED = 'FULFILLED';
const REJECTED = exports.REJECTED = 'REJECTED';
const HASHED = exports.HASHED = 'HASHED';
const CONFIRMED = exports.CONFIRMED = 'CONFIRMED';
const RECIEPT = exports.RECIEPT = 'RECIEPT';
const ERROR = exports.ERROR = 'ERROR';
const defaultTypes = exports.defaultTypes = {
  pending: PENDING,
  fulfilled: FULFILLED,
  rejected: REJECTED,
  transactionHash: HASHED,
  confirmation: CONFIRMED,
  reciept: RECIEPT,
  error: ERROR
};
//# sourceMappingURL=constants.js.map