'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = web3Middleware;

var _isPromiEvent = require('./isPromiEvent');

var _isPromise = require('./isPromise');

var _constants = require('./constants');

function web3Middleware(config = {}) {
  const PROMIEVENT_TYPE_SUFFIXES = config.promiEventTypeSuffixes || _constants.defaultTypes;
  const PROMIEVENT_TYPE_DELIMITER = config.promiEventTypeDelimiter || '_';

  return store => {
    const { dispatch } = store;

    return next => action => {
      let promiEventOrPromise;
      let data;
      let isRegularPromise;

      if (!action.payload) {
        return next(action);
      }

      const PAYLOAD = action.payload;

      /*
       * 3 cases
       * 1. action.payload is a promiEvent or promise
       * 2. action.payload.promiEvent or action.payload.promise is
       * 3. neither is and we should just call next
       */

      if ((0, _isPromiEvent.isPromiEvent)(PAYLOAD) || (0, _isPromise.isPromise)(PAYLOAD)) {
        promiEventOrPromise = PAYLOAD;
        isRegularPromise = !(0, _isPromiEvent.isPromiEvent)(PAYLOAD);
      } else if ((0, _isPromiEvent.isPromiEvent)(PAYLOAD.promiEvent) || (0, _isPromise.isPromise)(PAYLOAD.promiEvent) || (0, _isPromiEvent.isPromiEvent)(PAYLOAD.promise) || (0, _isPromise.isPromise)(PAYLOAD.promise)) {
        promiEventOrPromise = PAYLOAD.promiEvent || PAYLOAD.promise;
        data = PAYLOAD.data;
        isRegularPromise = !(0, _isPromiEvent.isPromiEvent)(promiEventOrPromise) && (0, _isPromise.isPromise)(promiEventOrPromise);
      } else {
        return next(action);
      }

      const TYPE = action.type;
      const META = action.meta;

      const createAction = (newPayload, event) => {
        const type = [TYPE, PROMIEVENT_TYPE_SUFFIXES[event]].join(PROMIEVENT_TYPE_DELIMITER);

        const payload = newPayload === null || typeof newPayload === 'undefined' ? {} : { payload: newPayload };

        const error = event === 'error' || event === 'rejected' ? { error: true } : {};

        const meta = META !== undefined ? { meta: META } : {};

        return _extends({
          type
        }, payload, error, meta);
      };

      const onFulfilled = result => dispatch(createAction(result, 'fulfilled'));
      const onRejected = err => dispatch(createAction(err, 'rejected'));
      const onTransactionHash = hash => dispatch(createAction(hash, 'transactionHash'));
      const onReceipt = receipt => dispatch(createAction(receipt, 'reciept'));
      const onError = err => dispatch(createAction(err, 'error'));

      let confirmationsCount = 0;
      const onConfirmation = (confirmationNumber, reciept) => {
        confirmationsCount += 1;

        return dispatch(createAction({
          confirmationNumber,
          reciept,
          confirmationsCount
        }, 'confirmation'));
      };

      dispatch(createAction(data, 'pending'));

      if (isRegularPromise) {
        return promiEventOrPromise.then(onFulfilled).catch(onRejected);
      }
      return promiEventOrPromise.on('transactionHash', onTransactionHash).on('confirmation', onConfirmation).on('receipt', onReceipt).on('error', onError).then(onFulfilled).catch(onRejected);
    };
  };
}
//# sourceMappingURL=index.js.map