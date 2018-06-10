import Promise from 'bluebird'
import { PromiEvent, MockStore, MockNext } from './mocks'
import EventEmitter from 'events'

import isPromiEvent from '../src/isPromiEvent'
import web3Middleware from '../src'



describe ('test isPromiEvent', () => {
  it('should return false for null', () => {
    expect(isPromiEvent(null).toBe(false));
  });

  it ('should return false for a non object', () => {
    expect(isPromiEvent(true)).toBe(false);
  });

  it ('should return false for a EventEmitter that is not a promise', () => {
    expect(isPromiEvent(new EventEmitter)).toBe(false);
  });

  it('should return false for a Promise that is not an EventEmitter', () => {
    expect(isPromiEvent(Promise.resolve(null))).toBe(false);
  });

  it ('should return true for a PromiEvent', () => {
    expect(isPromiEvent(new PromiEvent(Promise.resolve(null)))).toBe(true);
  });
});

describe ('test web3Middleware', () => {
  let dispatchAction;
  let mockNext;
  let mockStore;

  const CALLED_NEXT_ACTION = 'called next(action)';

  beforeEach(() => {
    mockNext = new MockNext();
    mockStore = new MockStore();
    dispatchAction = web3Middleware()(mockStore)(mockNext.next.bind(mockNext));
  });

  it('should return next action if payload doesn\'t exist', () => {
    const result = CALLED_NEXT_ACTION;

    dispatchAction({result});

    expect(mockNext.actions[0].result).toBe(result);
  });

  it('should return next action if payload is not a promiEvent and payload.promiEvent is not a promievent', () => {
    const result = CALLED_NEXT_ACTION;

    dispatchAction({
      payload: {
        thisPayload: 'not promise',
        promiEvent: 'not a promiEvent'
      },
      result
    });

    expect(mockNext.actions[0].result).toBe(result);
  });

  it('should not call next if payload is a PromiEvent', () => {
    const promiEvent = new PromiEvent(Promise.resolve(null));

    dispatchAction({
      payload = promiEvent
    })

    expect(mockNext.actions.length).toBe(0);
  })

  it('should not call next if payload.promiEvent is a PromiEvent', () => {
    const promiEvent = new PromiEvent(Promise.resolve(null))

    dispatchAction({
      payload: {
        promiEvent
      }
    });

    expect(mockNext.actions.length).toBe(0);
  });

  it('should dispatch _PENDING right away', () => {

  });

  it('should dispatch _FULFILLED when fulfilled', () => {

  });

  it('should dispatch _REJECTED when rejected', () => {

  });

  it('should dispatch _HASHED when hashed', () => {

  });

  it('should dispatch _CONFIRMATION when on a confirmation event', () => {

  });

  it ('should track how many confirmations have happened', () => {

  });

  it ('should dispatch _RECEIPT on receipt', () => {

  });

  it ('should dispatch _ERROR on error', () => {

  });
});