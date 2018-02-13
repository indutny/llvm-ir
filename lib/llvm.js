'use strict';

const internal = require('./llvm/');
const types = internal.types;
const values = internal.values;
const instructions = internal.instructions;

const assert = require('assert');
const Buffer = require('buffer').Buffer;

const kState = Symbol('state');

class State {
  constructor() {
    this.structs = [];
    this.strings = new Map();
    this.functions = [];
  }
}

class LLVM {
  constructor(options) {
    this.options = Object.assign({}, options);
    this[kState] = new State();
  }

  static create(options) {
    return new LLVM(options);
  }

  cstr(value) {
    const state = this[kState];
    if (state.strings.has(value))
      return state.strings.get(value).ref();

    assert.strictEqual(typeof value, 'string',
      'Non-string argument for `.cstr()`');

    const id = '.cstr' + state.strings.size;
    const len = Buffer.byteLength(value);
    const buf = Buffer.alloc(len + 1);
    buf.write(value);

    const res = new values.CStr(id, buf);
    this[kState].strings.set(value, res);
    return res.ref();
  }

  struct(name) {
    const res = new types.Struct(name);
    this[kState].structs.push(res);
    return res;
  }

  void() {
    return new types.Void();
  }

  i(width) {
    return new types.Int(width);
  }

  signature(ret, args = []) {
    return new types.Signature(ret, args);
  }

  fn(signature, name, params = []) {
    const res = new values.Function(signature, name, params);
    this[kState].functions.push(res);
    return res;
  }

  _(name, ...args) {
    return new instructions.Instruction(name, args);
  }

  build() {
    let out = '';

    const state = this[kState];
    const serializer = new internal.Serializer();

    state.strings.forEach(str => out += serializer.string(str) + '\n');
    state.structs.forEach(s => out += serializer.struct(s) + '\n');
    state.functions.forEach((fn) => {
      // Reset counters
      serializer.reset();

      out += serializer.function(fn) + '\n';
    });

    return out;
  }
}
module.exports = LLVM;
