'use strict';

const internal = require('./llvm/');
const types = internal.types;
const values = internal.values;
const instructions = internal.instructions;

const kAnonymous = internal.symbols.kAnonymous;

const assert = require('assert');
const Buffer = require('buffer').Buffer;

const kState = Symbol('state');

class State {
  constructor() {
    this.structs = new Map();
    this.data = new Map();
    this.metadata = new Map();
    this.functions = [];
    this.declarations = new Map();
    this.arrays = [];
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
    if (state.data.has(value))
      return state.data.get(value).ref();

    assert.strictEqual(typeof value, 'string',
      'Non-string argument for `.cstr()`');

    const id = '.cstr' + state.data.size;
    const len = Buffer.byteLength(value);
    const buf = Buffer.alloc(len + 1);
    buf.write(value);

    const res = new values.Data(id, buf);
    state.data.set(value, res);
    return res.ref();
  }

  data(value) {
    const state = this[kState];
    if (state.data.has(value))
      return state.data.get(value).ref();

    assert(Buffer.isBuffer(value),  'Non-Buffer argument for `.data()`');

    const id = '.data' + state.data.size;
    const res = new values.Data(id, value);
    state.data.set(value, res);
    return res.ref();
  }

  struct(name) {
    const state = this[kState];
    const res = new types.Struct(name);
    if (state.structs.has(res.type)) {
      const cached = state.structs.get(res.type);
      assert(cached.isEqual(res), `Conflicting struct types for "${name}"`);
      return cached;
    }

    this[kState].structs.set(res.type, res);
    return res;
  }

  array(type, elems) {
    const state = this[kState];
    assert(type instanceof types.Array,
      'Invalid `type` argument of `.array()`');
    assert(type.of.isInt(),
      'Only integer global arrays are supported at the moment');

    const id = '.arr' + state.arrays.length;
    state.arrays.push({ id, value: type.v(elems) });
    return new values.Ref(type, id);
  }

  metadata(content) {
    const state = this[kState];
    if (state.metadata.has(content))
      return state.metadata.get(content);

    const res = '!' + state.metadata.size;
    state.metadata.set(content, res);
    return res;
  }

  static void() {
    return new types.Void();
  }

  void() {
    return LLVM.void();
  }

  static i(width) {
    return new types.Int(width);
  }

  i(width) {
    return LLVM.i(width);
  }

  static signature(ret, args = []) {
    return new types.Signature(ret, args);
  }

  signature(ret, args = []) {
    return LLVM.signature(ret, args);
  }

  fn(signature, name, params = []) {
    const res = new values.Function(signature, name, params);
    this[kState].functions.push(res);
    return res;
  }

  declare(signature, name) {
    const state = this[kState];
    if (state.declarations.has(name)) {
      const cached = state.declarations.get(name);

      // TODO(indutny): choose lowest subset of attributes
      assert(cached.type.isEqual(signature),
        `\`.declare()\` signature mismatch for "${name}"`);
      return cached;
    }

    const res = new values.Declaration(signature, name);
    state.declarations.set(name, res);
    return res;
  }

  static _(name, ...args) {
    return new instructions.Instruction(name, args);
  }

  _(name, ...args) {
    return LLVM._(name, ...args);
  }

  static comment(value) {
    return new instructions.Comment(value);
  }

  comment(value) {
    return LLVM.comment(value);
  }

  static label(name) {
    return new instructions.Label(name);
  }

  label(name) {
    return LLVM.label(name);
  }

  build() {
    let out = '';

    const state = this[kState];
    const serializer = new internal.Serializer();

    state.data.forEach(str => out += serializer.data(str) + '\n');
    if (out && state.arrays.length !== 0) out += '\n';
    state.arrays.forEach(arr => out += serializer.array(arr) + '\n');
    if (out && state.structs.size !== 0) out += '\n';
    state.structs.forEach((s) => {
      // No need to declare anonymous structs
      if (s[kAnonymous])
        return;

      out += serializer.struct(s) + '\n';
    });
    if (out && state.declarations.size !== 0) out += '\n';
    state.declarations.forEach(d => out += serializer.declaration(d) + '\n');
    if (out && state.functions.length !== 0) out += '\n';

    state.functions.forEach((fn, i) => {
      const isLast = i === state.functions.length - 1;
      // Reset counters
      serializer.reset();

      out += serializer.function(fn) + '\n';
      if (!isLast)
        out += '\n';
    });
    if (out && state.metadata.size !== 0) out += '\n';
    state.metadata.forEach((key, meta) => out += `${key} = !{${meta}}\n`);

    return out;
  }
}
module.exports = LLVM;
