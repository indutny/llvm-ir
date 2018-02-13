'use strict';
/* global describe it beforeEach */

const assert = require('assert');

const IR = require('../');
const Serializer = require('../lib/llvm/').Serializer;

describe('IR/Serializer', () => {
  let ir;
  let s;
  beforeEach(() => {
    ir = new IR();
    s = new Serializer();
  });

  it('should serialize string', () => {
    const str = ir.cstr('hello');

    const use = ir._('something', [ str.type, str ]);
    assert.strictEqual(s.instruction(use),
      '%i0 = something [6 x i8]* @.cstr0');

    assert.strictEqual(ir.build(),
      '@.cstr0 = private unnamed_addr constant [6 x i8] c"hello\\00"\n');
  });

  it('should serialize struct', () => {
    const state = ir.struct('state');

    state.field(ir.i(32), 'hello');
    state.field(ir.i(8).ptr(), 'world');

    assert.strictEqual(s.struct(state), [
      '%state = type {',
      '  i32, ; 0 => "hello"',
      '  i8* ; 1 => "world"',
      '}'
    ].join('\n'));
  });

  it('should serialize function', () => {
    const i32 = ir.i(32);
    const sig = ir.signature(i32, [ i32 ]);
    const fn = ir.fn(sig, 'fn', [ 'p' ]);

    fn.visibility = 'internal';

    const add = ir._('add', [ i32, i32.v(1) ], fn.arg('p'));
    const add2 = ir._('add', [ i32, add ], add);

    fn.body.push([ add, add2 ]);

    const target = fn.body.jump('br');
    target.terminate('ret', [ i32, add2 ]);

    assert.strictEqual(s.function(fn), [
      'define internal i32 @fn(i32 %p) {',
      '  %i0 = add i32 1, %p',
      '  %i1 = add i32 %i0, %i0',
      '  br label %b0',
      'b0:',
      '  ret i32 %i1',
      '}'
    ].join('\n'));
  });
});
