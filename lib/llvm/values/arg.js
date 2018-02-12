'use strict';

const values = require('./');

class Arg extends values.Value {
  constructor(type, name) {
    super(type);

    this.name = name;
  }
}
module.exports = Arg;
