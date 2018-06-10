import Promise from 'bluebird'
import EventEmitter from 'events'

export default class PromiEvent extends EventEmitter {
  constructor(promise) {
    this.then = promise.then.bind(promise)
    this.catch = promise.catch.bind(promise)
  }
}