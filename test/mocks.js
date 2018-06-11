import EventEmitter from 'events'

export class MockPromiEvent extends EventEmitter {
  constructor(promise) {
    super();
    if (!promise) {
      throw new Error('no promise provided');
    }
    if (typeof promise.then !== 'function') {
      throw new Error('no promise provided');
    }
    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);
  }
}

export class MockStore {
  constructor() {
    this.dispatched = [];
  }

  dispatch = (obj) => {
    this.dispatched.push(obj);
  }
}

export class MockNext {
  constructor() {
    this.actions = [];
  }

  next = (action) => {
    this.actions.push(action);
  }
}
