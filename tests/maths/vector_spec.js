import Vector from 'maths/vector';
import {expect} from 'chai';

describe('maths.Vector({x, y})', () => {
	describe('#x', () => {
		it('is the x coordinate of this vector', () => {
			const v = Vector({x: 1, y: 0});
			expect(v.x).to.equal(1);
		});
	});
	describe('#y', () => {
		it('is the y coordinate of this vector', () => {
			const v = Vector({x: 1, y: 0});
			expect(v.y).to.equal(0);
		});
	});
	describe('#norm', () => {
		it('is the norm of this vector', () => {
			const v = Vector({x: 1, y: 0});
			expect(v.norm).to.equal(1);
		});
	});
	describe('#mutAdd({x, y})', () => {
		it('adds the given vector to itself', () => {
			const v1 = Vector({x: 1, y: 0});
			const v2 = Vector({x: 0, y: 1});
			v1.mutAdd(v2);
			expect(v1.x).to.equal(1);
			expect(v1.y).to.equal(1);
		});
		it('returns itself', () => {
			const v = Vector({x: 1, y: 0});
			expect(v.mutAdd({x: 0, y: 1})).to.equal(v);
		});
	});
	describe('#add({x, y})', () => {
		it('adds this vector to an other', () => {
			const v1 = Vector({x: 1, y: 0});
			const v2 = Vector({x: 0, y: 1});
			const v3 = v1.add(v2);
			expect(v3.x).to.equal(1);
			expect(v3.y).to.equal(1);
		});
		it('creates a new Vector', () => {
			const v1 = Vector({x: 1, y: 0});
			const v2 = Vector({x: 0, y: 1});
			const v3 = v1.add(v2);
			expect(v3).to.not.equal(v1);
			expect(v3).to.not.equal(v2);
		});
	});
	describe('#mutSub({x, y})', () => {
		it('subtract the given vector to itself', () => {
			const v1 = Vector({x: 1, y: 1});
			const v2 = Vector({x: 1, y: 1});
			v1.mutSub(v2);
			expect(v1.x).to.equal(0);
			expect(v1.y).to.equal(0);
		});
		it('returns itself', () => {
			const v = Vector({x: 1, y: 0});
			expect(v.mutSub({x: 0, y: 1})).to.equal(v);
		});
	});
	describe('sub({x, y})', () => {
		it('subs this vector to an other', () => {
			const v1 = Vector({x: 1, y: 0});
			const v2 = Vector({x: 0, y: 1});
			const v3 = v1.sub(v2);
			expect(v3.x).to.equal(1);
			expect(v3.y).to.equal(-1);
		});
		it('creates a new Vector', () => {
			const v1 = Vector({x: 1, y: 0});
			const v2 = Vector({x: 0, y: 1});
			const v3 = v1.sub(v2);
			expect(v3).to.not.equal(v1);
			expect(v3).to.not.equal(v2);
		});
	});
	describe('#mutMul(k)', () => {
		it('multiply itself by the given factor', () => {
			const v1 = Vector({x: 1, y: 1});
			v1.mutMul(2);
			expect(v1.x).to.equal(2);
			expect(v1.y).to.equal(2);
		});
		it('returns itself', () => {
			const v = Vector({x: 1, y: 0});
			expect(v.mutMul({x: 0, y: 1})).to.equal(v);
		});
	});
	describe('mul(k)', () => {
		it('scale this vector by a factor k', () => {
			const v1 = Vector({x: 1, y: 1});
			const v2 = v1.mul(2);
			expect(v2.x).to.equal(2);
			expect(v2.y).to.equal(2);
		});
		it('creates a new Vector', () => {
			const v1 = Vector({x: 1, y: 1});
			const v2 = v1.mul(2);
			expect(v2).to.not.equal(v1);
		});
	});
	describe('scalar({x, y})', () => {
		it('compute the scalar product of this vector with an other vector', () => {
			const v1 = Vector({x: 1, y: 0});
			const v2 = Vector({x: 0, y: 1});
			expect(v1.scalar(v2)).to.equal(0);
		});
	});
	describe('distance({x, y})', () => {
		it('compute the distance between this vector and an other vector', () => {
			const v1 = Vector({x: 1, y: 0});
			const v2 = Vector({x: 0, y: 1});
			expect(v1.distance(v2)).to.be.closeTo(Math.sqrt(2), 0.000000001);
		});
	});
	describe('equal({x, y})', () => {
		it('returns true if this vector equals the given one', () => {
			const v1 = Vector({x: 1, y: 0});
			const v2 = Vector({x: 1, y: 0});
			expect(v1.equal(v2)).to.be.true;
		});
		it('returns false if this vector does not equal the given one', () => {
			const v1 = Vector({x: 1, y: 0});
			const v2 = Vector({x: 0, y: 1});
			expect(v1.equal(v2)).to.be.false;
		})
	});
	describe('isNull()', () => {
		it('returns true is this vector is the null vector', () => {
			expect(Vector({x: 0, y: 0}).isNull()).to.be.true;
			expect(Vector({x: 1, y: 0}).isNull()).to.be.false;
			expect(Vector({x: 0, y: 1}).isNull()).to.be.false;
			expect(Vector({x: 1, y: 1}).isNull()).to.be.false;
		});
	})
});
