import createVector from 'vector';
import {expect} from 'chai';

describe('createVector({x, y})', () => {
	const v = createVector({x: 0, y: 0});
	it('creates and return a new Vector object', () => {
		expect(v).to.be.an('object');
		expect(v.x).to.be.a('number');
		expect(v.y).to.be.a('number');
		expect(v.norm).to.be.a('number');
		expect(v.add).to.be.a('function');
		expect(v.sub).to.be.a('function');
		expect(v.mul).to.be.a('function');
		expect(v.distance).to.be.a('function');
		expect(v.equal).to.be.a('function');
		expect(v.isNull).to.be.a('function');
	});
});

describe('Vector', () => {
	describe('x', () => {
		it('is the x coordinate of this vector', () => {
			const v = createVector({x: 1, y: 0});
			expect(v.x).to.equal(1);
		});
	});

	describe('y', () => {
		it('is the y coordinate of this vector', () => {
			const v = createVector({x: 1, y: 0});
			expect(v.y).to.equal(0);
		});
	});

	describe('norm', () => {
		it('is norm of this vector', () => {
			const v = createVector({x: 1, y: 0});
			expect(v.norm).to.equal(1);
		});
	});

	describe('add({x, y})', () => {
		it('adds this vector to an other', () => {
			const v1 = createVector({x: 1, y: 0});
			const v2 = createVector({x: 0, y: 1});
			const v3 = v1.add(v2);
			expect(v3.x).to.equal(1);
			expect(v3.y).to.equal(1);
		});
		it('creates a new Vector', () => {
			const v1 = createVector({x: 1, y: 0});
			const v2 = createVector({x: 0, y: 1});
			const v3 = v1.add(v2);
			expect(v3).to.not.equal(v1);
			expect(v3).to.not.equal(v2);
		});
	});

	describe('sub({x, y})', () => {
		it('subs this vector to an other', () => {
			const v1 = createVector({x: 1, y: 0});
			const v2 = createVector({x: 0, y: 1});
			const v3 = v1.sub(v2);
			expect(v3.x).to.equal(1);
			expect(v3.y).to.equal(-1);
		});
		it('creates a new Vector', () => {
			const v1 = createVector({x: 1, y: 0});
			const v2 = createVector({x: 0, y: 1});
			const v3 = v1.sub(v2);
			expect(v3).to.not.equal(v1);
			expect(v3).to.not.equal(v2);
		});
	});

	describe('mul(k)', () => {
		it('scale this vector by a factor k', () => {
			const v1 = createVector({x: 1, y: 1});
			const v2 = v1.mul(2);
			expect(v2.x).to.equal(2);
			expect(v2.y).to.equal(2);
		});
		it('creates a new Vector', () => {
			const v1 = createVector({x: 1, y: 1});
			const v2 = v1.mul(2);
			expect(v2).to.not.equal(v1);
		});
	});

	describe('scalar({x, y})', () => {
		it('compute the scalar product of this vector with an other vector', () => {
			const v1 = createVector({x: 1, y: 0});
			const v2 = createVector({x: 0, y: 1});
			expect(v1.scalar(v2)).to.equal(0);
		});
	});

	describe('distance({x, y})', () => {
		it('compute the distance between this vector and an other vector', () => {
			const v1 = createVector({x: 1, y: 0});
			const v2 = createVector({x: 0, y: 1});
			expect(v1.distance(v2)).to.be.closeTo(Math.sqrt(2), 0.000000001);
		});
	});

	describe('equal({x, y})', () => {
		it('returns true if this vector equals the given one', () => {
			const v1 = createVector({x: 1, y: 0});
			const v2 = createVector({x: 1, y: 0});
			expect(v1.equal(v2)).to.be.true;
		});
		it('returns false if this vector does not equal the given one', () => {
			const v1 = createVector({x: 1, y: 0});
			const v2 = createVector({x: 0, y: 1});
			expect(v1.equal(v2)).to.be.false;
		})
	});

	describe('isNull()', () => {
		it('returns true is this vector is the null vector', () => {
			expect(createVector({x: 0, y: 0}).isNull()).to.be.true;
			expect(createVector({x: 1, y: 0}).isNull()).to.be.false;
			expect(createVector({x: 0, y: 1}).isNull()).to.be.false;
			expect(createVector({x: 1, y: 1}).isNull()).to.be.false;
		});
	})
});
