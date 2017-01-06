import { expect } from 'chai';
import bind_events from 'sound/controls/event-binder';
import jsdom from 'jsdom';
import sinon from 'sinon';

const sandbox = sinon.sandbox.create();

describe('bind_events()', ()=> {

	const document = jsdom.jsdom('arkanoid');
	global.document = document;

	beforeEach(() => {
		sandbox.spy(document, 'addEventListener');
		sandbox.spy(document, 'removeEventListener');
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('attaches calls addEventListener on the DOM', () => {
		bind_events({
			mousedown: () => {}
		});
		expect(document.addEventListener.calledOnce).to.be.true;
	});

	it('attaches a mousedown event listener on the DOM', () => {
		bind_events({
			mousedown: () => {}
		});
		expect(document.addEventListener.calledWith('mousedown')).to.be.true;
	});

	it('resets mousedown event listener on the DOM', () => {
		const event_binder = bind_events();
		event_binder.mousedown(()=>{});
		expect(document.removeEventListener.calledOnce).to.be.true;
		expect(document.removeEventListener.calledWith('mousedown')).to.be.true;
		expect(document.addEventListener.calledOnce).to.be.true;
		expect(document.addEventListener.calledWith('mousedown')).to.be.true;
	});

	it('resets mousedown event listener on the DOM', () => {
		const event_binder = bind_events();
		event_binder.mousedown(()=>{});
		expect(document.removeEventListener.calledOnce).to.be.true;
		expect(document.removeEventListener.calledWith('mousedown')).to.be.true;
		expect(document.addEventListener.calledOnce).to.be.true;
		expect(document.addEventListener.calledWith('mousedown')).to.be.true;
	});

});
