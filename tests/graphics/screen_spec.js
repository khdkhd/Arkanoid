import {expect} from 'chai';

import Screen from 'graphics/screen';
import Rect from 'maths/rect';
import CanvasContextMock from 'tests/canvas-context-mock';

describe('graphics.Screen(canvas_context)', () => {
	it('creates and return a new Screen object', () => {
		const screen = Screen(CanvasContextMock());
		expect(screen).to.be.an('object');
	});
});

describe('graphics.Screen(canvas_context)', () => {
	describe('#width', () => {
		it('returns the width of the screen', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			expect(screen.width).to.equal(context.canvas.width);
		});
		it('sets the width of the screen when affected a value', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.width = 42;
			expect(context.canvas.width).to.equal(42);
		});
	});
	describe('#height', () => {
		it('returns the height of the screen', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			expect(screen.height).to.equal(context.canvas.height);
		});
		it('sets the height of the screen when affected a value', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.height = 42;
			expect(context.canvas.height).to.equal(42);
		});
	});
	describe('#size', () => {
		it('returns a {width, height} object representing the size of the screen', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			expect(screen.size).to.deep.equal(context.canvas);
		});
		it('sets the size of the screen when affected a {width, height} object', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.size = {
				width: 42,
				height: 42
			};
			expect(context.canvas.width).to.equal(42);
			expect(context.canvas.height).to.equal(42);
		});
	});
	describe('#rect', () => {
		it('returns the rect of the screen', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			const r = screen.rect;
			expect(r.x).to.equal(0);
			expect(r.y).to.equal(0);
			expect(r.width).to.equal(context.canvas.width);
			expect(r.height).to.equal(context.canvas.height);
		});
	});
	describe('#pen', () => {
		it('returns the screen current pen', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			const pen = screen.pen;
			expect(pen.lineWidth).to.be.a('number');
			expect(pen.strokeStyle).to.exist;
		});
		it('sets the line width when a Number is affected', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.pen = 42;
			expect(context.lineWidth).to.equal(42);
			expect(context.strokeStyle).to.equal('black');
		});
		it('sets the stroke style when a String is affected', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.pen = 'red';
			expect(context.lineWidth).to.equal(1);
			expect(context.strokeStyle).to.equal('red');
		});
		it('sets the line width and stroke style when a {lineWidth, strokeStyle} object is affected', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.pen = {
				lineWidth: 42,
				strokeStyle: 'red'
			};
			expect(context.lineWidth).to.equal(42);
			expect(context.strokeStyle).to.equal('red');
		});
	});
	describe('#brush', () => {
		it('returns the current brush of the screen', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			const brush = screen.brush;
			expect(brush.fillStyle).to.equal('white');
		});
		it('sets the fill style of the context when a String is affected', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.brush = 'red';
			expect(context.fillStyle).to.equal('red');
		});
	});
	describe('#clear()', () => {
		it('calls fillRect once on the context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.clear();
			expect(context.fillRect.calledOnce).to.be.true;
			expect(context.fillRect.thisValues[0]).to.equal(context);
		});
		it('calls fillRect with the good parameters', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			const {width, height} = context.canvas;
			screen.clear();
			expect(context.fillRect.calledWith(0, 0, width, height)).to.be.true;
		})
	});
	describe('#drawLine(p1, p2)', () => {
		const p1 = {x: 0,   y: 0};
		const p2 = {x: 100, y: 100};

		it('calls beginPath once on the context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.drawLine(p1, p2);
			expect(context.beginPath.calledOnce).to.be.true;
			expect(context.beginPath.thisValues[0]).to.equal(context);
		});
		it('calls moveTo once on the context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.drawLine(p1, p2);
			expect(context.moveTo.calledOnce).to.be.true;
			expect(context.moveTo.thisValues[0]).to.equal(context);
		});
		it('calls moveTo with p1.x and p1.y as parameters', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.drawLine(p1, p2);
			expect(context.moveTo.calledWith(p1.x, p1.y)).to.be.true;
		});
		it('calls lineTo once on the context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.drawLine(p1, p2);
			expect(context.lineTo.calledOnce).to.be.true;
			expect(context.lineTo.thisValues[0]).to.equal(context);
		});
		it('calls lineTo with p2.x and p2.y as parameters', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.drawLine(p1, p2);
			expect(context.lineTo.calledWith(p2.x, p2.y)).to.be.true;
		});
		it('calls stroke once on the context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.drawLine(p1, p2);
			expect(context.stroke.calledOnce).to.be.true;
			expect(context.stroke.thisValues[0]).to.equal(context);
		});
		it('calls beginPath, moveTo, lineTo and stroke in this order', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.drawLine(p1, p2);
			expect(context.beginPath.calledBefore(context.moveTo)).to.be.true;
			expect(context.moveTo.calledBefore(context.lineTo)).to.be.true;
			expect(context.lineTo.calledBefore(context.stroke)).to.be.true;
		});
	});
	describe('#drawRect(r)', () => {
		const r = Rect({x: 0, y: 0}, {width: 1, height: 1});

		it('calls beginPath once on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.drawRect(r);
			expect(context.beginPath.calledOnce).to.be.true;
		});
		it('calls moveTo once on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.drawRect(r);
			expect(context.moveTo.calledOnce).to.be.true;
		});
		it('calls moveTo with r.topLeft.x and r.topLeft.y as parameters', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.drawRect(r);
			expect(context.moveTo.calledWith(r.topLeft.x, r.topLeft.y)).to.be.true;
		});
		it('calls lineTo thrice on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.drawRect(r);
			expect(context.lineTo.calledThrice).to.be.true;
		});
		it('calls lineTo with good parameters in the good order', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);

			screen.drawRect(r);

			const [call1, call2, call3] = [
				context.lineTo.getCall(0),
				context.lineTo.getCall(1),
				context.lineTo.getCall(2)
			];

			expect(call1.calledWith(r.topRight.x, r.topRight.y)).to.be.true;
			expect(call2.calledWith(r.bottomRight.x, r.bottomRight.y)).to.be.true;
			expect(call3.calledWith(r.bottomLeft.x, r.bottomLeft.y)).to.be.true;
		});
		it('calls closePath once on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.drawRect(r);
			expect(context.closePath.calledOnce).to.be.true;
		});
		it('calls stroke once on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.drawRect(r);
			expect(context.stroke.calledOnce).to.be.true;
		});
		it('calls beginPath, moveTo, lineTo, closePath and stroke in this order', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.drawRect(r);
			expect(context.beginPath.calledBefore(context.moveTo)).to.be.true;
			expect(context.moveTo.calledBefore(context.lineTo)).to.be.true;
			expect(context.lineTo.calledBefore(context.closePath)).to.be.true;
			expect(context.closePath.calledBefore(context.stroke)).to.be.true;
		});
	});
	describe('#fillRect(r)', () => {
		const r = Rect({x: 0, y: 0}, {width: 1, height: 1});

		it('calls beginPath once on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.fillRect(r);
			expect(context.beginPath.calledOnce).to.be.true;
		});
		it('calls moveTo once on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.fillRect(r);
			expect(context.moveTo.calledOnce).to.be.true;
		});
		it('calls moveTo with r.topLeft.x and r.topLeft.y as parameters', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.fillRect(r);
			expect(context.moveTo.calledWith(r.topLeft.x, r.topLeft.y)).to.be.true;
		});
		it('calls lineTo thrice on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.fillRect(r);
			expect(context.lineTo.calledThrice).to.be.true;
		});
		it('calls lineTo with good parameters in the good order', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);

			screen.fillRect(r);

			const [call1, call2, call3] = [
				context.lineTo.getCall(0),
				context.lineTo.getCall(1),
				context.lineTo.getCall(2)
			];

			expect(call1.calledWith(r.topRight.x, r.topRight.y)).to.be.true;
			expect(call2.calledWith(r.bottomRight.x, r.bottomRight.y)).to.be.true;
			expect(call3.calledWith(r.bottomLeft.x, r.bottomLeft.y)).to.be.true;
		});
		it('calls closePath once on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.fillRect(r);
			expect(context.closePath.calledOnce).to.be.true;
		});
		it('calls fill once on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.fillRect(r);
			expect(context.fill.calledOnce).to.be.true;
		});
		it('calls beginPath, moveTo, lineTo, closePath and fill in this order', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.fillRect(r);
			expect(context.beginPath.calledBefore(context.moveTo)).to.be.true;
			expect(context.moveTo.calledBefore(context.lineTo)).to.be.true;
			expect(context.lineTo.calledBefore(context.closePath)).to.be.true;
			expect(context.closePath.calledBefore(context.fill)).to.be.true;
		});
	});
	describe('#beginPath', () => {
		it('calls beginPath on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.beginPath();
			expect(context.beginPath.calledOnce).to.be.true;
		});
	});
	describe('#closePath', () => {
		it('calls closePath on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.closePath();
			expect(context.closePath.calledOnce).to.be.true;
		});
	});
	describe('#moveTo(p)', () => {
		it('calls moveTo on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.moveTo({x: 0, y: 0});
			expect(context.moveTo.calledOnce).to.be.true;
		});
		it('calls moveTo with p.x and p.y as parameters', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.moveTo({x: 0, y: 0});
			expect(context.moveTo.calledWith(0, 0)).to.be.true;
		});
	});
	describe('#lineTo(p)', () => {
		it('calls lineTo on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.lineTo({x: 0, y: 0});
			expect(context.lineTo.calledOnce).to.be.true;
		});
		it('calls lineTo with p.x and p.y as parameters', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.lineTo({x: 0, y: 0});
			expect(context.lineTo.calledWith(0, 0)).to.be.true;
		});
	});
	describe('#arc(p, radius, start_angle, end_angle, anticlockwise)', () => {
		it('calls arc on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.arc({x: 0, y: 0}, 1, 2, 3, false);
			expect(context.arc.calledOnce).to.be.true;
		});
		it('calls arc with p.x, p.y, radius, start_angle, end_angle and anticlockwise as parameters', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.arc({x: 0, y: 1}, 2, 3, 4, false);
			expect(context.arc.calledWith(0, 1, 2, 3, 4, false)).to.be.true;
			screen.arc({x: 0, y: 1}, 2, 3, 4, true);
			expect(context.arc.calledWith(0, 1, 2, 3, 4, true)).to.be.true;
		});
	});
	describe('#drawPath(path)', () => {
		it('calls stroke on the context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.drawPath({});
			expect(context.stroke.calledOnce).to.be.true;
		});
		it('calls stroke with no parameters if path is not defined', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.drawPath();
			expect(context.stroke.args[0]).to.be.empty;
		});
		it('calls stroke with path if defined', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			const path = {};
			screen.drawPath(path);
			expect(context.stroke.calledWith(path)).to.be.true;
		});
	});
	describe('#fillPath(path)', () => {
		it('calls fill on the context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.fillPath({});
			expect(context.fill.calledOnce).to.be.true;
		});
		it('calls fill with no parameters if path is not defined', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.fillPath();
			expect(context.fill.args[0]).to.be.empty;
		});
		it('calls fill with path if defined', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			const path = {};
			screen.fillPath(path);
			expect(context.fill.calledWith(path)).to.be.true;
		});
	});
	describe('#save()', () => {
		it('calls save once on the context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.save();
			expect(context.save.calledOnce).to.be.true;
			expect(context.save.thisValues[0]).to.equal(context);
		});
	});
	describe('#restore()', () => {
		it('calls restore once on the context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.restore();
			expect(context.restore.calledOnce).to.be.true;
			expect(context.restore.thisValues[0]).to.equal(context);
		});
	});
	describe('#scale(f)', () => {
		it('calls scale once on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.scale(1);
			expect(context.scale.calledOnce).to.be.true;
		});
		it('calls scale with f, f as parameters', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.scale(1);
			expect(context.scale.calledWith(1, 1)).to.be.true;
		});
	});
	describe('#scale({x, y})', () => {
		it('calls scale once on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.scale({x: 1, y: 2});
			expect(context.scale.calledOnce).to.be.true;
		});
		it('calls scale with f, f as parameters', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.scale({x: 1, y: 2});
			expect(context.scale.calledWith(1, 2)).to.be.true;
		});
	});
	describe('#translate({x, y})', () => {
		it('calls translate once on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.translate({x: 1, y: 2});
			expect(context.translate.calledOnce).to.be.true;
		});
		it('calls translate with f, f as parameters', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.translate({x: 1, y: 2});
			expect(context.translate.calledWith(1, 2)).to.be.true;
		});
	});
	describe('#rotate(angle)', () => {
		it('calls rotate once on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.rotate(1);
			expect(context.rotate.calledOnce).to.be.true;
		});
		it('calls rotate with angle as parameters', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.rotate(1);
			expect(context.rotate.calledWith(1)).to.be.true;
		});
	});
	describe('#createLinearGradient(p1, p2, stops)', () => {
		it('calls createLinearGradient once on context', () => {
			const context = CanvasContextMock();
			const screen = Screen(context);
			screen.createLinearGradient({x: 0, y: 0}, {x: 1, y: 1}, []);
			expect(context.createLinearGradient.calledOnce).to.be.true;
		});
	});
});
