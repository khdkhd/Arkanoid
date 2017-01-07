import { expect } from 'chai';
import ui from 'sound/controls/ui';
import document from '../test-assets/dom';
import sinon from 'sinon';

const sandbox = sinon.sandbox.create();

describe('bind_events()', ()=> {

	const context = {};

	beforeEach(() => {
		global.document = document;
		context.canvas = document.getElementById('screen');
		sandbox.spy(context.canvas, 'addEventListener');
		sandbox.spy(context.canvas, 'removeEventListener');
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('attaches calls addEventListener on the canvas element', () => {
		ui.bind_events({
			mousedown: () => {}
		});
		expect(context.canvas.addEventListener.calledOnce).to.be.true;
	});

	it('attaches a mousedown event listener on the canvas element', () => {
		ui.bind_events({
			mousedown: () => {}
		});
		expect(context.canvas.addEventListener.calledWith('mousedown')).to.be.true;
	});

	it('resets mousedown event listener on the canvas element', () => {
		const event_binder = ui.bind_events();
		event_binder.mousedown(()=>{});
		expect(context.canvas.removeEventListener.calledOnce).to.be.true;
		expect(context.canvas.removeEventListener.calledWith('mousedown')).to.be.true;
		expect(context.canvas.addEventListener.calledOnce).to.be.true;
		expect(context.canvas.addEventListener.calledWith('mousedown')).to.be.true;
	});

	it('resets mousedown event listener on the canvas element', () => {
		const event_binder = ui.bind_events();
		event_binder.mousedown(()=>{});
		expect(context.canvas.removeEventListener.calledOnce).to.be.true;
		expect(context.canvas.removeEventListener.calledWith('mousedown')).to.be.true;
		expect(context.canvas.addEventListener.calledOnce).to.be.true;
		expect(context.canvas.addEventListener.calledWith('mousedown')).to.be.true;
	});

});
