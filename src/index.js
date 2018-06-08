import isPromiEvent from './isPromiEvent'
import { defaultTypes } from './constants'

export default function web3Middleware(config = {}) {
  const PROMISE_TYPE_SUFFIXES = config.promiseTypeSuffixes || defaultTypes;
  const PROMISE_TYPE_DELIMITER = config.promiseTypeDelimiter || '_';

  return store => {
    const { dispatch } = store;

    return next => action => {

      let promiEvent;
      let data;

      if (!action.payload) {
        return next(action);
      }

      const PAYLOAD = action.payload;

      /*
       * 3 cases
       * 1. PAYLOAD is promiEvent
       * 2. PAYLOAD.promiEvent is promiEvent
       * 3. Neither then just move on to next middleware
       */

      if (isPromiEvent(PAYLOAD)) {
        promiEvent = PAYLOAD;

      } else if (isPromiEvent(PAYLOAD.promiEvent)){
        promise = PAYLOAD.promise;
        data = PAYLOAD.data;

      } else {
        return next(action)
      }

      const TYPE = action.type;
      const META = action.meta;

      const getAction = (newPayload, event) => {
        const type = [
          TYPE,
          PROMISE_TYPE_SUFFIXES[event],
        ].join(PROMISE_TYPE_DELIMITER);

        const payload = newPayload === null || typeof newPayload === 'undefined'
          ? {}
          : {payload: newPayload};

        const error = event === 'error' || event === 'rejected' ? {error: true} : {};

        const meta = meta !== undefined ? {meta: META} : {}

        return ({
          type,
          ...payload,
          ...error,
          ...meta,
        })
      }

      // dispatch pending first
      next(getAction(getAction(data, defaultTypes.pending)));

      const onFulfilled = result => dispatch(getAction(result, defaultTypes.fulfilled));

      const onTransactionHash = hash => dispatch(getAction(hash, defaultTypes.transactionHash));

      const onConfirmation = (confirmationNumber, reciept) => dispatch(getAction({confirmationNumber, receipt}, defaultTypes.confirmation));

      const onReceipt = receipt => dispatch(getAction(receipt, defaultTypes.receipt));

      const onError = err => {
        dispatch(getAction(err, defaultTypes.rejected)));
        throw err;
      };


      return promise
        .then(onFulfilled)
        .catch(onError)
        .on(defaultTypes.transactionHash, onTransactionHash))
        .on(defaultTypes.confirmation, onConfirmation)
        .on(defaultTypes.receipt, onReceipt)
        .on(defaultTypes.error, onError);
    }

  }
}