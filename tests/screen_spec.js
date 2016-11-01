import createScreen from 'screen';
import createRect from 'rect';
import {expect} from 'chai';
import sinon from 'sinon';

const screen_width  = 200;
const screen_height = 200;

const canvas_context_methods = [
	'save',
	'restore',
	'clearRect',
	'fillRect',
	'strokeRect',
	'stroke',
	'fill',
	'moveTo',
	'lineTo',
	'scale',
	'rotate',
	'translate'
];
const canvas_context = Object.assign(
	{
		canvas: {
			width:  screen_width,
			height: screen_height
		}
	},
	canvas_context_methods.reduce((mock, method) => {
		mock[method] = sinon.spy();
		return mock;
	}, {})
);

beforeEach(() => {
	for (let method of canvas_context_methods) {
		canvas_context[method].reset();
	}
});

describe('createScreen(canvas_context)', () => {
	const screen = createScreen(canvas_context);
	it('creates and return a new Screen object', () => {
		expect(screen).to.be.an('object');
	});
});

describe('Screen', () => {
	let screen;

	beforeEach(() => {
		screen = createScreen(canvas_context);
		screen.toggleSnap(false);
	});

	describe('size', () => {
		it('returns the size of the screen', () => {
			expect(screen.size).to.deep.equal(canvas_context.canvas);
		});
	});

	describe('rect', () => {
		it('returns the rect of the screen', () => {
			const r = screen.rect;
			expect(r.x).to.equal(0);
			expect(r.y).to.equal(0);
			expect(r.width).to.equal(canvas_context.canvas.width);
			expect(r.height).to.equal(canvas_context.canvas.height);
		});
	});

	describe('save()', () => {
		it('calls save once on the context', () => {
			screen.save();
			expect(canvas_context.save.calledOnce).to.be.true;
			expect(canvas_context.save.thisValues[0]).to.equal(canvas_context);
		});
	});

	describe('restore()', () => {
		it('calls restore once on the context', () => {
			screen.restore();
			expect(canvas_context.restore.calledOnce).to.be.true;
			expect(canvas_context.restore.thisValues[0]).to.equal(canvas_context);
		});
	});

	describe('clear()', () => {
		it('calls fillRect once on the context', () => {
			screen.clear();
			expect(canvas_context.fillRect.calledOnce).to.be.true;
			expect(canvas_context.fillRect.thisValues[0]).to.equal(canvas_context);
		});
		it('calls fillRect with the good parameters', () => {
			const {width, height} = canvas_context.canvas;
			screen.clear();
			expect(canvas_context.fillRect.calledWith(0, 0, width, height)).to.be.true;
		})
	});

	describe('drawLine(p1, p2)', () => {
		const p1 = {x: 0,   y: 0};
		const p2 = {x: 100, y: 100};

		it('calls save once on the context', () => {
			screen.drawLine(p1, p2);
			expect(canvas_context.save.calledOnce).to.be.true;
			expect(canvas_context.save.thisValues[0]).to.equal(canvas_context);
		});
		it('calls moveTo once on the context', () => {
			screen.drawLine(p1, p2);
			expect(canvas_context.moveTo.calledOnce).to.be.true;
			expect(canvas_context.moveTo.thisValues[0]).to.equal(canvas_context);
		});
		it('calls lineTo once on the context', () => {
			screen.drawLine(p1, p2);
			expect(canvas_context.lineTo.calledOnce).to.be.true;
			expect(canvas_context.lineTo.thisValues[0]).to.equal(canvas_context);
		});
		it('calls restore once on the context', () => {
			screen.drawLine(p1, p2);
			expect(canvas_context.restore.calledOnce).to.be.true;
			expect(canvas_context.restore.thisValues[0]).to.equal(canvas_context);
		});
		it('calls save, moveTo, lineTo and restore in this order', () => {
			screen.drawLine(p1, p2);
			expect(canvas_context.save.calledBefore(canvas_context.moveTo)).to.be.true;
			expect(canvas_context.moveTo.calledBefore(canvas_context.lineTo)).to.be.true;
			expect(canvas_context.lineTo.calledBefore(canvas_context.restore)).to.be.true;
		});
		it('calls moveTo with p1.x and p1.y as parameters', () => {
			screen.drawLine(p1, p2);
			expect(canvas_context.moveTo.calledWith(p1.x, p1.y)).to.be.true;
		});
		it('calls lineTo with p2.x and p2.y as parameters', () => {
			screen.drawLine(p1, p2);
			expect(canvas_context.lineTo.calledWith(p2.x, p2.y)).to.be.true;
		});
	});

	describe('drawPath(path)', () => {
		it('calls stroke on the context', () => {
			screen.drawPath({});
			expect(canvas_context.stroke.calledOnce).to.be.true;
		});
		it('forwards its parameter to context.stroke', () => {
			const path = {};
			screen.drawPath(path);
			expect(canvas_context.stroke.calledWith(path)).to.be.true;
		});
	});

	describe('fillPath(path)', () => {
		it('calls fill on the context', () => {
			screen.fillPath({});
			expect(canvas_context.fill.calledOnce).to.be.true;
		});
		it('forwards its parameter to context.fill', () => {
			const path = {};
			screen.fillPath(path);
			expect(canvas_context.fill.calledWith(path)).to.be.true;
		});
	});
});
