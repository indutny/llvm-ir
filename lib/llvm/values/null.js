'use strict';

const values = require('./');

class Null extends values.Value {
  constructor(type) {
    super(type);
  }
}
module.exports = Null;
