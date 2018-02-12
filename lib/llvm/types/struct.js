'use strict';

const assert = require('assert');

const types = require('./');

class Struct extends types.Type {
  constructor(name) {
    super('%' + name);

    // TODO(indutny): validate name
    this.name = name;
    this.fields = [];
  }

  field(type, name) {
    assert(type instanceof types.Type, '`type` must be a Type instance');

    const index = this.fields.length;
    this.fields.push({ type, name });
    return index;
  }

  lookup(name) {
    for (let i = 0; i < this.fields.length; i++)
      if (this.fields[i].name === name)
        return i;

    throw new Error(`Field ${name} not found`);
  }
}
module.exports = Struct;
