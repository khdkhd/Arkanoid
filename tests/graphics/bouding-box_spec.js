import {expect} from 'chai';
import Vector from 'maths/vector';
import BoundingBox from 'graphics/bounding-box';

describe('graphics.BoundingBox({position, size, alignCenterToOrigin: false})', () => {
	const state = {
		alignCenterToOrigin: false,
		size: {width: 1, height: 1},
		position: Vector({x: 42, y: 43})
	};
	describe('#boundingBox.absolute', () => {
		it('returns Rect(position, size) ', () => {
			const bb = BoundingBox(state);
			const {x, y, width, height} = bb.boundingBox.absolute;
			expect(x).to.equal(state.position.x);
			expect(y).to.equal(state.position.y);
			expect(width).to.equal(state.size.width);
			expect(height).to.equal(state.size.height);
		});
	});
	describe('#boundingBox.relative', () => {
		it('returns Rect({x: 0, y: 0}, size)', () => {
			const bb = BoundingBox(state);
			const {x, y, width, height} = bb.boundingBox.relative;
			expect(x).to.equal(0);
			expect(y).to.equal(0);
			expect(width).to.equal(state.size.width);
			expect(height).to.equal(state.size.height);
		});
	});
});

describe('graphics.BoundingBox({position, size, alignCenterToOrigin: true})', () => {
	const state = {
		alignCenterToOrigin: true,
		size: {width: 1, height: 1},
		position: Vector({x: 42, y: 43})
	};
	describe('#boundingBox.absolute', () => {
		it('returns Rect(origin, size) with its center equals to position', () => {
			const bb = BoundingBox(state);
			const {center: {x, y}, width, height} = bb.boundingBox.absolute;
			expect(x).to.equal(state.position.x);
			expect(y).to.equal(state.position.y);
			expect(width).to.equal(state.size.width);
			expect(height).to.equal(state.size.height);
		});
	});
	describe('#boundingBox.relative', () => {
		it('returns Rect({x: -size.width/2, y: -size.height/2}, size)', () => {
			const bb = BoundingBox(state, true);
			const {x, y, width, height} = bb.boundingBox.relative;
			expect(x).to.equal(-width/2);
			expect(y).to.equal(-height/2);
			expect(width).to.equal(state.size.width);
			expect(height).to.equal(state.size.height);
		});
	});
});
