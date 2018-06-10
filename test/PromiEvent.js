import EventEmitter from 'events'
import Promise from 'bluebird'

export default class PromiEvent extends EventEmitter {
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