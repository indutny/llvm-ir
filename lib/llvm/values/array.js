'use strict';

const values = require('./');

class ArrayVal extends values.Value {
  constructor(type, elems) {
    super(type);

    this.elems = elems.map(v => type.of.v(v));
  }
}
module.exports = ArrayVal;
