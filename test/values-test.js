'use strict';
/* global describe it beforeEach */

const assert = require('assert');

const IR = require('../');

describe('IR/types', () => {
  let ir;
  beforeEach(() => {
    ir = new IR();
  });

  describe('function', () => {
    it('should return proper argument with `.arg()`', () => {
      const sig = ir.signature(ir.i(32), [ ir.i(8), ir.i(64) ]);
      const fn = ir.fn(sig, 'fn', [ 'a', 'b' ]);

      assert.strictEqual(fn.arg('a').type.type, 'i8');
      assert.strictEqual(fn.arg('b').type.type, 'i64');
    });
  });
});
