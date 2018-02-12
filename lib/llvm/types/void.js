'use strict';

const types = require('./');

class Void extends types.Type {
  constructor() {
    super('void');
  }

  ptr() {
    throw new Error('Can\'t make pointer to `void`');
  }
}
module.exports = Void;
