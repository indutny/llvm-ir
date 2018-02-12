'use strict';

const internal = require('./llvm/');
const types = internal.types;
const values = internal.values;
const instructions = internal.instructions;
const CStr = internal.CStr;

const kState = Symbol('state');

class State {
  constructor() {
    this.structs = [];
    this.strings = [];
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
    // TODO(indutny): de-duplicate?
    // TODO(indutny): implement me
    const res = new CStr(value);
    this[kState].strings.push(res);
    return res;
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

  signature(ret, args) {
    return new types.Signature(ret, args || []);
  }

  fn(signature, name, params) {
    const res = new values.Function(signature, name, params || []);
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

    state.strings.forEach(str => out += serializer.string(str));
    state.structs.forEach(s => out += serializer.struct(s));
    state.functions.forEach(fn => out += serializer.function(fn));

    return out;
  }
}
module.exports = LLVM;
