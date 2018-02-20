'use strict';
/* global describe it beforeEach */

const assert = require('assert');

const IR = require('../');

describe('IR/types', () => {
  let ir;
  beforeEach(() => {
    ir = new IR();
  });

  describe('int', () => {
    it('should pass `.isInt()`', () => {
      assert(ir.i(8).isInt());
    });

    it('should have `.width`', () => {
      assert.strictEqual(ir.i(8).width, 8);
    });

    it('should have `.type`', () => {
      assert.strictEqual(ir.i(8).type, 'i8');
    });

    it('should have `.ptr()`', () => {
      assert.strictEqual(ir.i(8).ptr().type, 'i8*');
    });

    it('should have `.array()`', () => {
      assert.strictEqual(ir.i(8).array(8).type, '[8 x i8]');
    });

    it('should create values', () => {
      const i8 = ir.i(8);
      const v = i8.v(1);

      assert.strictEqual(v.type, i8);
      assert.strictEqual(v.value, 1);
    });

    it('should create `null` ptr', () => {
      const i8p = ir.i(8).ptr();
      const v = i8p.v(null);

      assert.strictEqual(v.type, i8p);
    });
  });

  describe('void', () => {
    it('should pass `.isVoid()`', () => {
      assert(ir.void().isVoid());
    });

    it('should have `.type`', () => {
      assert.strictEqual(ir.void().type, 'void');
    });

    it('should throw on `.ptr()`', () => {
      assert.throws(() => ir.void().ptr());
    });
  });

  describe('struct', () => {
    it('should pass `.isStruct()`', () => {
      assert(ir.struct('state').isStruct());
    });

    it('should have `.type`', () => {
      assert.strictEqual(ir.struct('state').type, '%state');
    });

    it('should have `.ptr()`', () => {
      assert.strictEqual(ir.struct('state').ptr().type, '%state*');
    });

    it('should define fields', () => {
      const state = ir.struct('state');

      const kHello = state.field(ir.i(32), 'hello');
      const kWorld = state.field(ir.i(8).ptr(), 'world');

      assert.equal(kHello, 0);
      assert.equal(kWorld, 1);

      assert.equal(state.lookup('hello'), kHello);
      assert.equal(state.lookup('world'), kWorld);
    });
  });

  describe('signature', () => {
    it('should pass `.signature()`', () => {
      assert(ir.signature(ir.i(8), []).isSignature());
    });

    it('should have `.type`', () => {
      const s = ir.signature(ir.i(8), [ ir.i(8).ptr(), ir.i(64) ]);
      assert.strictEqual(s.type, 'i8 (i8*, i64)');
    });

    it('should have `.ptr()`', () => {
      const s = ir.signature(ir.i(8), [ ir.i(8).ptr(), ir.i(64).ptr() ]);
      assert.strictEqual(s.ptr().type, 'i8 (i8*, i64*)*');
    });
  });
});
