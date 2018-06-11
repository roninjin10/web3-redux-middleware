import isPromiEvent from './isPromiEvent'
import { defaultTypes } from './constants'

export default function web3Middleware(config = {}) {
  const PROMIEVENT_TYPE_SUFFIXES = config.promiEventTypeSuffixes || defaultTypes;
  const PROMIEVENT_TYPE_DELIMITER = config.promiEventTypeDelimiter || '_';

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
        promiEvent = PAYLOAD.promiEvent;
        data = PAYLOAD.data;

      } else {
        return next(action)
      }

      const TYPE = action.type;
      const META = action.meta;

      const getAction = (newPayload, event) => {
        const type = [
          TYPE,
          PROMIEVENT_TYPE_SUFFIXES[event],
        ].join(PROMIEVENT_TYPE_DELIMITER);

        const payload = newPayload === null || typeof newPayload === 'undefined'
          ? {}
          : {payload: newPayload};

        const error = event === 'error' || event === 'rejected' ? {error: true} : {};

        const meta = META !== undefined ? {meta: META} : {}

        return ({
          type,
          ...payload,
          ...error,
          ...meta,
        })
      }

      // dispatch pending first
      next(getAction(data, defaultTypes.pending));

      const onFulfilled = result => dispatch(getAction(result, defaultTypes.fulfilled));

      const onTransactionHash = hash => dispatch(getAction(hash, defaultTypes.transactionHash));

      let confirmationsCount = 0;
      const onConfirmation = (confirmationNumber, reciept) => {
        confirmationsCount += 1;

        return dispatch(getAction({
          confirmationNumber,
          reciept,
          confirmationsCount
        }, defaultTypes.confirmation));
      };

      const onReceipt = receipt => dispatch(getAction(receipt, defaultTypes.receipt));

      const onError = err => {
        dispatch(getAction(err, defaultTypes.rejected))
        throw err;
      };


      return promiEvent
        .on('transactionHash', onTransactionHash)
        .on('confirmation', onConfirmation)
        .on('receipt', onReceipt)
        .on('error', onError)
        .then(onFulfilled)
        .catch(onError);
    }

  }
}