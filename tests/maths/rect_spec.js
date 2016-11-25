import Rect from 'maths/rect';
import Vector from 'maths/vector';
import {expect} from 'chai';

describe('Rect({x, y}, {width, height})', () => {
	const r = Rect({x: 0, y: 0}, {width: 100, height: 100});
	it('creates and return a new Rect object', () => {
		expect(r).to.be.an('object');
		expect(r.x).to.be.a('number');
		expect(r.y).to.be.a('number');
		expect(r.width).to.be.a('number');
		expect(r.height).to.be.a('number');
		expect(r.topLeft).to.be.an('object');
		expect(r.topRight).to.be.an('object');
		expect(r.bottomRight).to.be.an('object');
		expect(r.bottomLeft).to.be.an('object');
		expect(r.center).to.be.an('object');
		expect(r.contains).to.be.a('function');
		expect(r.intersect).to.be.an('function');
	});
});

describe('Rect', () => {
	describe('x', () => {
		it('is the x coordinate of this rectangle', () => {
			const r = Rect({x: 10, y: 15}, {width: 20, height: 25});
			expect(r.x).to.equal(10);
		});
	});

	describe('y', () => {
		it('is the y coordinate of this rectangle', () => {
			const r = Rect({x: 10, y: 15}, {width: 20, height: 25});
			expect(r.y).to.equal(15);
		});
	});

	describe('width', () => {
		it('is the width of this rectangle', () => {
			const r = Rect({x: 10, y: 15}, {width: 20, height: 25});
			expect(r.width).to.equal(20);
		});
	});

	describe('height', () => {
		it('is the height of this rectangle', () => {
			const r = Rect({x: 10, y: 15}, {width: 20, height: 25});
			expect(r.height).to.equal(25);
		});
	});

	describe('size', () => {
		it('returns the size of this rectangle', () => {
			const r = Rect({x: 10, y: 15}, {width: 20, height: 25});
			expect(r.size).to.deep.equal({
				width: 20,
				height: 25
			});
		});
	});

	describe('leftX', () => {
		it('returns the left x value of this rectangle', () => {
			const r = Rect({x: 10, y: 15}, {width: 20, height: 25});
			expect(r.leftX).to.equal(10);
		});
	});

	describe('rightX', () => {
		it('returns the right x value of this rectangle', () => {
			const r = Rect({x: 10, y: 15}, {width: 20, height: 25});
			expect(r.rightX).to.equal(30);
		});
	});

	describe('topY', () => {
		it('returns the top y value of this rectangle', () => {
			const r = Rect({x: 10, y: 15}, {width: 20, height: 25});
			expect(r.topY).to.equal(15);
		});
	});

	describe('bottomY', () => {
		it('returns the bottom y value of this rectangle', () => {
			const r = Rect({x: 10, y: 15}, {width: 20, height: 25});
			expect(r.bottomY).to.equal(40);
		});
	});

	describe('topLeft', () => {
		it('returns a vector with the top left coordinates of this rectangle', () => {
			const r = Rect({x: 10, y: 15}, {width: 20, height: 25});
			expect(r.topLeft.x).to.equal(10);
			expect(r.topLeft.y).to.equal(15);
		});
	});

	describe('topRight', () => {
		it('returns a vector with the top right coordinates of this rectangle', () => {
			const r = Rect({x: 10, y: 15}, {width: 20, height: 25});
			expect(r.topRight.x).to.equal(30);
			expect(r.topRight.y).to.equal(15);
		});
	});

	describe('bottomRight', () => {
		it('returns a vector with the bottom right coordinates of this rectangle', () => {
			const r = Rect({x: 10, y: 15}, {width: 20, height: 25});
			expect(r.bottomRight.x).to.equal(30);
			expect(r.bottomRight.y).to.equal(40);
		});
	});

	describe('bottomLeft', () => {
		it('returns a vector with the bottom left coordinates of this rectangle', () => {
			const r = Rect({x: 10, y: 15}, {width: 20, height: 25});
			expect(r.bottomLeft.x).to.equal(10);
			expect(r.bottomLeft.y).to.equal(40);
		});
	});

	describe('center', () => {
		it('returns a vector with the center coordinates of this rectangle', () => {
			const r = Rect({x: 10, y: 10}, {width: 10, height: 10});
			expect(r.center.x).to.equal(15);
			expect(r.center.y).to.equal(15);
		});
	});

	describe('contains', () => {
		const r = Rect({x: 10, y: 10}, {width: 10, height: 10});
		const p = Vector({x: 21, y: 21});
		it('returns true for the center of this rectangle', () => {
			expect(r.contains(r.center)).to.be.true;
		});
		it('returns true for the top left corner of this rectangle', () => {
			expect(r.contains(r.topLeft)).to.be.true;
		});
		it('returns true for the top right corner of this rectangle', () => {
			expect(r.contains(r.topRight)).to.be.true;
		});
		it('returns true for the bottom right corner of this rectangle', () => {
			expect(r.contains(r.bottomRight)).to.be.true;
		});
		it('returns true for the bottom left corner of this rectangle', () => {
			expect(r.contains(r.bottomLeft)).to.be.true;
		});
		it('returns false for a given point outside of this rectangle', () => {
			expect(r.contains(p)).to.be.false;
		});
	});

	describe('intersect', () => {
		const r1 = Rect({x: 10, y: 10}, {width: 10, height: 10});
		const r2 = Rect({x: 0, y: 0}, {width: 20, height: 20});
		const r3 = Rect({x: 15, y: 15}, {width: 10, height: 10});
		const r4 = Rect({x: 21, y: 21}, {width: 20, height: 20});
		it('returns true for two equal rectangles', () => {
			expect(r1.intersect(r1)).to.be.true;
		});
		it('returns true for two nested rectangles', () => {
			expect(r1.intersect(r2)).to.be.true;
			expect(r2.intersect(r1)).to.be.true;
		});
		it('returns true for two overlapping rectangles', () => {
			expect(r1.intersect(r3)).to.be.true;
			expect(r3.intersect(r1)).to.be.true;
		});
		it('returns false for two disjoint rectangles', () => {
			expect(r1.intersect(r4)).to.be.false;
			expect(r4.intersect(r1)).to.be.false;
		});
	});

	describe('translate(v)', () => {
		it('return a new rectangle which is the image of this rectangle by the translation of the given vector', () => {
			const r1 = Rect({x: 0, y: 0}, {width: 1, height: 1});
			const r2 = r1.translate({x: 1, y: 2});
			expect(r2).to.not.equal(r1);
			expect(r2.topLeft.x).to.equal(1);
			expect(r2.topLeft.y).to.equal(2);
		});
		it('does not change the dimensions of the rectangle', () => {
			const r1 = Rect({x: 0, y: 0}, {width: 1, height: 1});
			const r2 = r1.translate({x: 1, y: 2});
			expect(r2.width).to.equal(r1.width);
			expect(r2.height).to.equal(r1.height);
		});
	});

});
