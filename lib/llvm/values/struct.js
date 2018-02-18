'use strict';

const assert = require('assert');

const values = require('./');

class Struct extends values.Value {
  constructor(type, values) {
    super(type);

    this.values = type.fields.map((field) => {
      assert(values.hasOwnProperty(field.name),
        `Missing "${field.name}" field in struct value`);

      const value = values[field.name];

      return [ field.type, field.type.v(value) ];
    });
  }
}
module.exports = Struct;
