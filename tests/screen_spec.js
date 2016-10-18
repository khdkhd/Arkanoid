import createScreen from 'screen';
import {expect} from 'chai';
import sinon from 'sinon';

describe('screen', () => {
	let canvas_context;
	let screen;
	beforeEach(() => {
		canvas_context = [
			'save', 'restore', 'clearRect', 'fillRect', 'strokeRect',
			'moveTo', 'lineTo', 'scale', 'rotate', 'translate'
		].reduce((mock, method) => {
			mock[method] = sinon.spy();
			return mock;
		}, {});
		canvas_context.canvas = {
			width: 200,
			height: 200
		};
		screen = createScreen(canvas_context);
		screen.toggleSnap(false);
	});

	describe('screenCreate(canvas_context)', () => {
		it('returns an object', () => {
			expect(screen).to.be.an('object');
		});
	});
	describe('save', () => {
		it('calls save once on the context', () => {
			screen.save();
			expect(canvas_context.save.calledOnce).to.be.true;
		});
	});
	describe('restore', () => {
		it('calls restore once on the context', () => {
			screen.restore();
			expect(canvas_context.restore.calledOnce).to.be.true;
		});
	});
	describe('clear', () => {
		it('calls fillRect once on the context', () => {
			const {width, height} = canvas_context.canvas;
			screen.clear();
			expect(canvas_context.fillRect.calledOnce).to.be.true;
			expect(canvas_context.fillRect.calledWith(0, 0, width, height)).to.be.true;
		});
	});
	describe('drawLine', () => {
		it('calls save, moveTo, LineTo and restore once on the context in this order', () => {
			screen.drawLine({x: 0, y: 0}, {x: 100, y: 100});
			expect(canvas_context.save.calledOnce).to.be.true;
			expect(canvas_context.moveTo.calledOnce).to.be.true;
			expect(canvas_context.moveTo.calledWith(0, 0)).to.be.true;
			expect(canvas_context.lineTo.calledOnce).to.be.true;
			expect(canvas_context.lineTo.calledWith(100, 100)).to.be.true;
			expect(canvas_context.restore.calledOnce).to.be.true;
			expect(canvas_context.save.calledBefore(canvas_context.moveTo)).to.be.true;
			expect(canvas_context.moveTo.calledBefore(canvas_context.lineTo)).to.be.true;
			expect(canvas_context.lineTo.calledBefore(canvas_context.restore)).to.be.true;
		});
	});
});
