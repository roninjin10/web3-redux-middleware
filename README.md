# Web3 Redux Middleware

PromiEvent-redux Middleware enables declarative reducers when making calls to the Ethereum network with Web3 [Redux](http://redux.js.org): it accepts a promiEvent or promise and dispatches pending, hashed, confirmed, receipt, fulfilled and rejected actions.

Heavily inspired by the popular [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware) library.

## Example
```js
import { createStore, applyMiddleware } from 'redux'
import web3Redux from 'web3-redux-middleware'

const store = createStore(
  promiEventReducer,
  {},
  applyMiddleware(web3Middleware())
);

const EXAMPLE = 'EXAMPLE';

const contract = new web3.eth.Contract(abi);

// To Use just attach a PromiEvent as a payload

const promiEventActionCreator = () => ({
  type: EXAMPLE,
  payload: contract
    .methods
    .contractMethod()
    .send({
      from: `0xE71b3853e8Dbc57Bc91E7504726e8F051c977e69`,
      value: 1000000
    })
});

// The middleware will intercept the action and dispatch actions as the network events occur

function promiEventReducer(state, action) {
  // A _PENDING event will be sent right away
  switch(action.type) {
    case `${EXAMPLE}_PENDING`:
      return state;

    // Other events will be released as the network events occur
    case `${EXAMPLE}_FULFILLED`:
      return {
        ...state,
        result: action.payload
      };

    case `${EXAMPLE}_HASHED`:
      return {
        ...state,
        hash: action.payload
      };

    case `${EXAMPLE}_CONFIRMED`:
      return {
        ...state,
        confirmationObject: action.payload,
        confirmationsCount: action.payload.confirmationsCount
      };

    case `${EXAMPLE}_RECEIPT`:
      return {
        ...state,
        receipt: action.payload
      };

    // Dispatched on .catch
    case `${EXAMPLE}_REJECTED`
      return {
        ...state,
        value: action.payload,
        isError: action.error,
      };

    // Dispatched on 'error' event
    case `${EXAMPLE}_ERROR`:
      return {
        ..state,
        value: action.payload,
        isError: action.error
      }
  }
};

// Alternatively you can attatch the promise to a promiEvent to the promiEvent property
// Common use case is when you want to send some data for optimistic loading
// The data will be dispatched on the _PENDING action
const promiEventAction2 = () => ({
  type: EXAMPLE,
  payload: {
    data: 'Some Data',
    promiEvent: contract
      .methods
      .contractMethod()
      .send({
        from: `0xE71b3853e8Dbc57Bc91E7504726e8F051c977e69`,
        value: 1000000
      })
});

// Any meta data can be attatched the the meta property.  It will be dispatched on every event
const promiEventAction3 = () => ({
  type: EXAMPLE,
  meta: 'some meta data'
  payload: contract
    .methods
    .contractMethod()
    .send({
      from: `0xE71b3853e8Dbc57Bc91E7504726e8F051c977e69`,
      value: 1000000
    })
})

// to change the promise type suffixes or the delimiter just pass in a config object
const configedWeb3Middleware = web3Redux({
  promiEventTypeDelimiter: ' ',
  promiEventTypeSuffixes: {
    pending: 'WAITING',
    fulfilled: 'SUCCESS',
    rejected: 'FAIL',
    transactionHash: 'TRANSACTION_HASHED',
    confirmation: 'CONFIRMATION',
    reciept: 'RECEIPT_RECIEVED',
    error: 'FAILURE'
  }
})

```

## Releases

- [Releases](https://github.com/roninjin10/web3-redux-middleware/releases)

## Maintainers

- William Cory (roninjin10):
  - [GitHub](https://github.com/roninjin10)
  - [Twitter](https://twitter.com/roninjin10)

Please reach out if you have any questions or comments!

## License

[Code licensed with the MIT License (MIT)](/LICENSE).
