import EventEmitter from 'events'
import Promise from 'bluebird'

export class PromiEvent extends EventEmitter {
  constructor(promise) {
    if (!promise) {
      throw new Error('no promise provided');
    }
    if (typeof promise.then !== 'function') {
      throw new Error('no promise provided');
    }
    this.then = promise.then.bind(promise)
    this.catch = promise.catch.bind(promise)
  }
}

export const mockStore = {
  dispatched: [],
  dispatch: (obj) => {
    this.dispatched.push(obj);
  }
}

export function mockNext(action) {
  this.actions.push(action);
}

mockNext.actions = [];