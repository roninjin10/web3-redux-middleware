import EventEmitter from 'events'

export class MockPromiEvent extends EventEmitter {
  constructor(promise) {
    super();
    this.then = promise.then.bind(promise);
    this.catch = promise.catch.bind(promise);
  }
}

export class MockStore {
  dispatched = [];

  dispatch = (obj) => {
    this.dispatched.push(obj);
  }
}

export class MockNext {
  actions = [];

  next = action => {
    this.actions.push(action);
  }
}
