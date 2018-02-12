'use strict';

const values = require('./');

class Int extends values.Value {
  constructor(type, value) {
    super(type);

    // TODO(indutny): validate that it fits
    this.value = value | 0;
  }
}
module.exports = Int;
