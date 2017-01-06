import keyboard from 'ui/keyboard';
import {expect} from 'chai';
import sinon from 'sinon';
import jsdom from 'jsdom';

describe('keyboard.createKeyHandler(code, ev, on_keydown, on_keyup, repeat)', () => {
	const code = 0;
	const event = 'event';
	const on_keydown = sinon.stub();
	const on_keyup = sinon.stub();

	beforeEach(() => {
		on_keydown.reset();
		on_keyup.reset();
	});

	it('returns an object width a code attribute wicth is a number', () => {
		const kh = keyboard.createKeyHandler({code, event, on_keydown, on_keyup});
		expect(kh.code).to.be.a('number');
	});
	it('returns an object width a keydown attribute wicth is a function', () => {
		const kh = keyboard.createKeyHandler({code, event, on_keydown, on_keyup});
		expect(kh.keydown).to.be.a('function');
	});
	it('returns an object width a keydup attribute wicth is a function', () => {
		const kh = keyboard.createKeyHandler({code, event, on_keydown, on_keyup});
		expect(kh.keyup).to.be.a('function');
	});
});

describe('keyboardHandler', () => {
	const code = 0;
	const event = 'event';
	const on_keydown = sinon.stub();
	const on_keyup = sinon.stub();

	on_keydown.returns(0);
	on_keyup.returns(0);

	beforeEach(() => {
		on_keydown.reset();
		on_keyup.reset();
	});

	describe('code', () => {
		it('is equal to the code passed at creation', () => {
			const kh = keyboard.createKeyHandler({code, event, on_keydown, on_keyup});
			expect(kh.code).to.equal(code);
		});
	});

	describe('keydown(v)', () => {
		it('calls back on_keydown each time it is invoked if repeat is set to true', () => {
			const kh = keyboard.createKeyHandler({code, event, on_keydown, on_keyup});
			kh.keydown();
			kh.keydown();
			expect(on_keydown.calledTwice).to.be.true;
		});
		it('calls back on_keydown once when invoked one or many times if repeat is set to false and keyup has not been invoked', () => {
			const kh = keyboard.createKeyHandler({code, event, on_keydown, on_keyup, repeat: false});
			kh.keydown();
			kh.keydown();
			expect(on_keydown.calledOnce).to.be.true;
		});
		it('forwards its argument to on_keydown', () => {
			const kh = keyboard.createKeyHandler({code, event, on_keydown, on_keyup, repeat: false});
			const arg = {};
			kh.keydown(arg);
			expect(on_keydown.calledWith(arg)).to.be.true;
		});
		it('returns an object with an event attribute set with the value passed at creation', () => {
			const kh = keyboard.createKeyHandler({code, event, on_keydown, on_keyup, repeat: false});
			const o = kh.keydown();
			expect(o.event).to.equal('event');
		});
		it('returns an object with a data attribute set with returned value of on_keydown', () => {
			const kh = keyboard.createKeyHandler({code, event, on_keydown, on_keyup, repeat: false});
			const o = kh.keydown();
			expect(o.data).to.equal(0);
		});
		it('returns an object with no data attribute set if on_keydown does not return any value', () => {
			const kh = keyboard.createKeyHandler({code, event, on_keydown: () => {}, on_keyup, repeat: false});
			const o = kh.keydown();
			expect(o.data).to.be.undefined;
		});
	});

	describe('keyup(v)', () => {
		it('calls back on_keyup each time it is invoked if repeat is set to true', () => {
			const kh = keyboard.createKeyHandler({code, event, on_keydown, on_keyup});
			kh.keyup();
			kh.keyup();
			expect(on_keyup.calledTwice).to.be.true;
		});
		it('calls back on_keyup each time it is invoked if repeat is set to false', () => {
			const kh = keyboard.createKeyHandler({code, event, on_keydown, on_keyup, repeat: false});
			kh.keyup();
			kh.keyup();
			expect(on_keyup.calledTwice).to.be.true;
		});
		it('forwards its argument to on_keyup', () => {
			const kh = keyboard.createKeyHandler({code, event, on_keydown, on_keyup});
			const arg = {};
			kh.keyup(arg);
			expect(on_keyup.calledWith(arg)).to.be.true;
		});
		it('returns an object with an event attribute set with the value passed at creation', () => {
			const kh = keyboard.createKeyHandler({code, event, on_keydown, on_keyup});
			const o = kh.keydown();
			expect(o.event).to.equal('event');
		});
		it('returns an object with a data attribute set with returned value of on_keyup', () => {
			const kh = keyboard.createKeyHandler({code, event, on_keydown, on_keyup});
			const o = kh.keyup();
			expect(o.data).to.equal(0);
		});
		it('returns an object with no data attribute set if on_keyup does not return any value', () => {
			const kh = keyboard.createKeyHandler({code, event, on_keydown, on_keyup: () => {}});
			const o = kh.keyup();
			expect(o.data).to.be.undefined;
		});
		it('enabled on_keydown to be invoked again if repeat has been disabled', () => {
			const kh = keyboard.createKeyHandler({code, event, on_keydown, on_keyup, repeat: false});
			kh.keydown();
			kh.keydown();
			kh.keyup();
			kh.keydown();
			expect(on_keydown.calledTwice).to.be.true;
		});
	});
});

describe('Keyboard.use([{}])', () => {
	const code = 0;
	const event = 'event';
	const on_keydown = sinon.spy();
	const on_keyup = sinon.stub();

	beforeEach(() => {
		const document = jsdom.jsdom();
		global.document = document;
		global.KeyboardEvent = document.defaultView.KeyboardEvent;
		on_keydown.reset();
		on_keyup.reset();
	});

	it('calls on_keydown when the key is pressed', () => {
		const kh = keyboard.createKeyHandler({code, event, on_keydown, on_keyup});
		keyboard.use([kh]);
		document.dispatchEvent(new KeyboardEvent('keydown', {keyCode: code}));
		expect(on_keydown).to.have.been.calledOnce;
	});

	it('does not call on_keydown when an other key is pressed', () => {
		const kh = keyboard.createKeyHandler({code, event, on_keydown, on_keyup});
		keyboard.use([kh]);
		document.dispatchEvent(new KeyboardEvent('keydown', {keyCode: code + 1}));
		expect(on_keydown).to.not.have.been.called;
	});

	it('calls on_keydup when the key is released', () => {
		const kh = keyboard.createKeyHandler({code, event, on_keydown, on_keyup});
		keyboard.use([kh]);
		document.dispatchEvent(new KeyboardEvent('keyup', {keyCode: code}));
		expect(on_keyup).to.have.been.calledOnce;
	});
});
