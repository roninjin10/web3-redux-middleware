import Promise from 'bluebird'
import { PromiEvent, MockStore, MockNext } from './mocks'
import EventEmitter from 'events'

import isPromiEvent from '../src/isPromiEvent'
import web3Middleware from '../src'



describe ('test isPromiEvent', () => {
  it('should return false for null', () => {
    expect(isPromiEvent(null).toBe(false));
  })

  it ('should return false for a non object', () => {
    expect(isPromiEvent(true)).toBe(false);
  })

  it ('should return false for a EventEmitter that is not a promise', () => {
    expect(isPromiEvent(new EventEmitter)).toBe(false);
  })

  it('should return false for a Promise that is not an EventEmitter'), () => {
    expect(isPromiEvent(Promise.resolve(null))).toBe(false);
  }

  it ('should return true for a PromiEvent', () => {
    expect(isPromiEvent(new PromiEvent(Promise.resolve(null)))).toBe(true);
  })
})

describe ('test web3Middleware', () => {
  let dispatchAction;
  let mockNext;
  let mockStore;

  beforeEach(() => {
    mockNext = new MockNext();
    mockStore = new MockStore();
    dispatchAction = web3Middleware()(mockStore)(mockNext.next.bind(mockNext));
  })
})