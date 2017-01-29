import {expect} from 'chai';
import Coordinates from 'graphics/coordinates';

describe('graphics.Coordinates(size, {x, y})', () => {
	const size = {width: 1, height: 1};
	const position = {x: 1, y: 1};
	describe('#position()', () => {
		it('returns Vector({x, y})', () => {
			const coordinates = Coordinates(size, position);
			const {x, y} = coordinates.position();
			expect(x).to.equal(position.x);
			expect(y).to.equal(position.y);
		});
	});
	describe('#size()', () => {
		it('returns size', () => {
			const coordinates = Coordinates(size, position);
			const {width, height} = coordinates.size();
			expect(width).to.equal(size.width);
			expect(height).to.equal(size.height);
		});
	});
	describe('#rect()', () => {
		it('returns Rect({x, y}, size) ', () => {
			const coordinates = Coordinates(size, position);
			const {x, y, width, height} = coordinates.rect();
			expect(x).to.equal(position.x);
			expect(y).to.equal(position.y);
			expect(width).to.equal(size.width);
			expect(height).to.equal(size.height);
		});
	});
	describe('#localRect()', () => {
		it('returns Rect({x: 0, y: 0}, size)', () => {
			const coordinates = Coordinates(size, position);
			const {x, y, width, height} = coordinates.localRect();
			expect(x).to.equal(0);
			expect(y).to.equal(0);
			expect(width).to.equal(size.width);
			expect(height).to.equal(size.height);
		});
	});
});
