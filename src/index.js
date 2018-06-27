import { isPromiEvent } from './isPromiEvent'
import { isPromise } from './isPromise'
import { defaultTypes } from './constants'

export default function web3Middleware(config = {}) {
  const PROMIEVENT_TYPE_SUFFIXES = config.promiEventTypeSuffixes || defaultTypes;
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

      if (isPromiEvent(PAYLOAD) || isPromise(PAYLOAD)) {
        promiEventOrPromise = PAYLOAD;
        isRegularPromise = !isPromiEvent(PAYLOAD);

      } else if (
        isPromiEvent(PAYLOAD.promiEvent) ||
        isPromise(PAYLOAD.promiEvent) ||
        isPromiEvent(PAYLOAD.promise) ||
        isPromise(PAYLOAD.promise)
      ) {
        promiEventOrPromise = PAYLOAD.promiEvent || PAYLOAD.promise;
        data = PAYLOAD.data;
        isRegularPromise = !isPromiEvent(promiEventOrPromise) && isPromise(promiEventOrPromise);

      } else {
        return next(action);
      }

      const TYPE = action.type;
      const META = action.meta;

      const createAction = (newPayload, event) => {
        const type = [
          TYPE,
          PROMIEVENT_TYPE_SUFFIXES[event]
        ].join(PROMIEVENT_TYPE_DELIMITER);

        const payload = newPayload === null || typeof newPayload === 'undefined'
          ? {}
          : {payload: newPayload};

        const error = event === 'error' || event === 'rejected' 
          ? {error: true} 
          : {};

        const meta = META !== undefined 
          ? {meta: META} 
          : {};

        return ({
          type,
          ...payload,
          ...error,
          ...meta,
        });
      }

      const onFulfilled = 
        result => dispatch(createAction(result, 'fulfilled'));
      
      const onRejected = 
        err => dispatch(createAction(err, 'rejected'));
      
      const onTransactionHash = 
        hash => dispatch(createAction(hash, 'transactionHash'));
      
      const onReceipt = 
        receipt => dispatch(createAction(receipt, 'reciept'));
      
      const onError = 
        err => dispatch(createAction(err, 'error'));

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
      return promiEventOrPromise
        .on('transactionHash', onTransactionHash)
        .on('confirmation', onConfirmation)
        .on('receipt', onReceipt)
        .on('error', onError)
        .then(onFulfilled)
        .catch(onRejected);
    }
  }
}
