'use strict';

const assert = require('assert');

const llvm = require('../');
const types = require('./');

const kAnonymous = llvm.symbols.kAnonymous;

class Struct extends types.Type {
  constructor(name) {
    let fields;

    // struct(fields)
    if (Array.isArray(name)) {
      fields = name;
      name = '_anonymous';
    }

    super('%' + name);

    this.name = llvm.utils.validate(name, 'Invalid struct name');
    this.fields = [];
    this[kAnonymous] = false;

    if (!fields)
      return;

    fields.forEach(field => this.field(field[0], field[1]));
    this.type = '{ ' + this.fields.map(f => f.type.type).join(', ') + ' }';
    this[kAnonymous] = true;
  }

  field(type, name) {
    assert(!this[kAnonymous], 'Can\'t add fields to anonymous struct');
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

  isEqual(to) {
    if (!this[kAnonymous] || !to[kAnonymous])
      return false;

    return this.type === to.type;
  }

  v(values) {
    return new llvm.values.Struct(this, values);
  }
}
module.exports = Struct;
