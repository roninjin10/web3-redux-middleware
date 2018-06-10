import Promise from 'bluebird'
import EventEmitter from 'events'
import Promise from 'bluebird'
import EventEmitter from 'events'

const PromiEvent = function(promise) {
  EventEmitter.call(this);
  this.then = promise.then.bind(promise)
  this.catch = promise.catch.bind(promise)
};

PromiEvent.prototype = Object.create(EventEmitter.prototype);
PromiEvent.constructor = EventEmitter;

export default PromiEvent