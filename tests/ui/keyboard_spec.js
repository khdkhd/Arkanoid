import {default as keyboard, KeyHandler} from 'ui/keyboard';
import {expect} from 'chai';
import is_nil from 'lodash.isnil';
import jsdom from 'jsdom';
import sinon from 'sinon';

describe('KeyHandler(code, ev, on_keypressed)', () => {
	const code = 0;
	const event = 'event';
	const on_keypressed = sinon.stub();

	on_keypressed.returns(0);

	beforeEach(() => {
		on_keypressed.reset();
	});

	describe('code', () => {
		it('is equal to the code passed at creation', () => {
			const kh = KeyHandler({code, event, on_keypressed});
			expect(kh.code).to.equal(code);
		});
	});

	describe('keydown', () => {
		it('is undefined', () => {
			const kh = KeyHandler({code, event, on_keypressed});
			expect(is_nil(kh.keydown)).to.be.true;
		});
	});

	describe('keyup', () => {
		it('is undefined', () => {
			const kh = KeyHandler({code, event, on_keypressed});
			expect(is_nil(kh.keyup)).to.be.true;
		});
	});

	describe('keypress(v)', () => {
		it('calls back on_keypressed each time it is invoked', () => {
			const kh = KeyHandler({code, event, on_keypressed});
			kh.keypress();
			kh.keypress();
			expect(on_keypressed.calledTwice).to.be.true;
		});
		it('forwards its argument to on_keypressed', () => {
			const kh = KeyHandler({code, event, on_keypressed});
			const arg = {};
			kh.keypress(arg);
			expect(on_keypressed.calledWith(arg)).to.be.true;
		});
		it('returns an object with an event attribute set with the value passed at creation', () => {
			const kh = KeyHandler({code, event, on_keypressed: () => {}});
			const o = kh.keypress();
			expect(o.event).to.equal('event');
		});
		it('returns an object with a data attribute set with returned value of on_press', () => {
			const kh = KeyHandler({code, event, on_keypressed});
			const o = kh.keypress();
			expect(o.data).to.equal(0);
		});
		it('returns an object with no data attribute set if on_keypressed does not return any value', () => {
			const kh = KeyHandler({code, event, on_keypressed: () => {}});
			const o = kh.keypress();
			expect(o.data).to.be.undefined;
		});
	});
});

describe('KeyHandler(code, ev, on_keydown, on_keyup, repeat)', () => {
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
			const kh = KeyHandler({code, event, on_keydown, on_keyup});
			expect(kh.code).to.equal(code);
		});
	});

	describe('keydown(v)', () => {
		it('calls back on_keydown each time it is invoked if repeat is set to true', () => {
			const kh = KeyHandler({code, event, on_keydown, on_keyup});
			kh.keydown();
			kh.keydown();
			expect(on_keydown.calledTwice).to.be.true;
		});
		it('calls back on_keydown once when invoked one or many times if repeat is set to false and keyup has not been invoked', () => {
			const kh = KeyHandler({code, event, on_keydown, on_keyup, repeat: false});
			kh.keydown();
			kh.keydown();
			expect(on_keydown.calledOnce).to.be.true;
		});
		it('forwards its argument to on_keydown', () => {
			const kh = KeyHandler({code, event, on_keydown, on_keyup, repeat: false});
			const arg = {};
			kh.keydown(arg);
			expect(on_keydown.calledWith(arg)).to.be.true;
		});
		it('returns an object with an event attribute set with the value passed at creation', () => {
			const kh = KeyHandler({code, event, on_keydown, on_keyup, repeat: false});
			const o = kh.keydown();
			expect(o.event).to.equal('event');
		});
		it('returns an object with a data attribute set with returned value of on_keydown', () => {
			const kh = KeyHandler({code, event, on_keydown, on_keyup, repeat: false});
			const o = kh.keydown();
			expect(o.data).to.equal(0);
		});
		it('returns an object with no data attribute set if on_keydown does not return any value', () => {
			const kh = KeyHandler({code, event, on_keydown: () => {}, on_keyup, repeat: false});
			const o = kh.keydown();
			expect(o.data).to.be.undefined;
		});
	});

	describe('keyup(v)', () => {
		it('calls back on_keyup each time it is invoked if repeat is set to true', () => {
			const kh = KeyHandler({code, event, on_keydown, on_keyup});
			kh.keyup();
			kh.keyup();
			expect(on_keyup.calledTwice).to.be.true;
		});
		it('calls back on_keyup each time it is invoked if repeat is set to false', () => {
			const kh = KeyHandler({code, event, on_keydown, on_keyup, repeat: false});
			kh.keyup();
			kh.keyup();
			expect(on_keyup.calledTwice).to.be.true;
		});
		it('forwards its argument to on_keyup', () => {
			const kh = KeyHandler({code, event, on_keydown, on_keyup});
			const arg = {};
			kh.keyup(arg);
			expect(on_keyup.calledWith(arg)).to.be.true;
		});
		it('returns an object with an event attribute set with the value passed at creation', () => {
			const kh = KeyHandler({code, event, on_keydown, on_keyup});
			const o = kh.keydown();
			expect(o.event).to.equal('event');
		});
		it('returns an object with a data attribute set with returned value of on_keyup', () => {
			const kh = KeyHandler({code, event, on_keydown, on_keyup});
			const o = kh.keyup();
			expect(o.data).to.equal(0);
		});
		it('returns an object with no data attribute set if on_keyup does not return any value', () => {
			const kh = KeyHandler({code, event, on_keydown, on_keyup: () => {}});
			const o = kh.keyup();
			expect(o.data).to.be.undefined;
		});
		it('enabled on_keydown to be invoked again if repeat has been disabled', () => {
			const kh = KeyHandler({code, event, on_keydown, on_keyup, repeat: false});
			kh.keydown();
			kh.keydown();
			kh.keyup();
			kh.keydown();
			expect(on_keydown.calledTwice).to.be.true;
		});
	});

	describe('keypress', () => {
		it('is undefined', () => {
			const kh = KeyHandler({code, event, on_keydown, on_keyup});
			expect(is_nil(kh.keypress)).to.be.true;
		});
	});
});

describe('keyboard.use([SOME_KEY_UP_DOWN_handler])', () => {
	const code = keyboard.KEY_A;
	const event = 'event';
	const on_keydown = sinon.spy();
	const on_keyup = sinon.spy();

	beforeEach(() => {
		const document = jsdom.jsdom();
		global.document = document;
		global.KeyboardEvent = document.defaultView.KeyboardEvent;
		on_keydown.reset();
		on_keyup.reset();
	});

	it('calls back on_keydown when SOME_KEY is down', () => {
		const kh = KeyHandler({code, event, on_keydown, on_keyup});
		keyboard.use([kh]);
		document.dispatchEvent(new KeyboardEvent('keydown', {keyCode: code}));
		expect(on_keydown).to.have.been.calledOnce;
	});

	it('does not call back on_keydown when an other key is down', () => {
		const kh = KeyHandler({code, event, on_keydown, on_keyup});
		keyboard.use([kh]);
		document.dispatchEvent(new KeyboardEvent('keydown', {keyCode: keyboard.KEY_B}));
		expect(on_keydown).to.not.have.been.called;
	});

	it('calls back on_keydup when SOME_KEY is released', () => {
		const kh = KeyHandler({code, event, on_keydown, on_keyup});
		keyboard.use([kh]);
		document.dispatchEvent(new KeyboardEvent('keyup', {keyCode: code}));
		expect(on_keyup).to.have.been.calledOnce;
	});

	it('does not call back on_keyup when an other key is released', () => {
		const kh = KeyHandler({code, event, on_keydown, on_keyup});
		keyboard.use([kh]);
		document.dispatchEvent(new KeyboardEvent('keyup', {keyCode: keyboard.KEY_B}));
		expect(on_keyup).to.not.have.been.called;
	});

	it('replace any previously used handlers', () => {
		const cb1 = sinon.spy();
		const cb2 = sinon.spy();
		const cb3 = sinon.spy();
		const cb4 = sinon.spy();
		keyboard.use([KeyHandler({code, event, on_keydown: cb1, on_keyup: cb2})]);
		keyboard.use([KeyHandler({code, event, on_keydown: cb3, on_keyup: cb4})]);
		document.dispatchEvent(new KeyboardEvent('keydown', {keyCode: code}));
		expect(cb1).to.not.have.been.called;
		expect(cb3).to.have.been.called;
		document.dispatchEvent(new KeyboardEvent('keyup', {keyCode: code}));
		expect(cb2).to.not.have.been.called;
		expect(cb4).to.have.been.called;

		const cb5 = sinon.spy();
		const cb6 = sinon.spy();
		const cb7 = sinon.spy();
		keyboard.use([KeyHandler({code, event, on_keypressed: cb5})]);
		keyboard.use([KeyHandler({code, event, on_keydown: cb6, on_keyup: cb7})]);
		document.dispatchEvent(new KeyboardEvent('keydown', {keyCode: code}));
		expect(cb5).to.not.have.been.called;
		expect(cb6).to.have.been.called;
		document.dispatchEvent(new KeyboardEvent('keyup', {keyCode: code}));
		expect(cb5).to.not.have.been.called;
		expect(cb7).to.have.been.called;
	});
});

describe('keyboard.use([SOME_KEY_PRESS_handler])', () => {
	const code = keyboard.KEY_A;
	const event = 'event';
	const on_keypressed = sinon.spy();

	beforeEach(() => {
		const document = jsdom.jsdom();
		global.document = document;
		global.KeyboardEvent = document.defaultView.KeyboardEvent;
		on_keypressed.reset();
	});

	it('calls on_keypressed when SOME_KEY is pressed', () => {
		const kh = KeyHandler({code, event, on_keypressed});
		keyboard.use([kh]);
		document.dispatchEvent(new KeyboardEvent('keypress', {keyCode: code}));
		expect(on_keypressed).to.have.been.calledOnce;
	});

	it('does not call on_keypressed when an other key is pressed', () => {
		const kh = KeyHandler({code, event, on_keypressed});
		keyboard.use([kh]);
		document.dispatchEvent(new KeyboardEvent('keypress', {keyCode: keyboard.KEY_B}));
		expect(on_keypressed).to.not.have.been.called;
	});

	it('replace any previously used handlers', () => {
		const cb1 = sinon.spy();
		const cb2 = sinon.spy();
		keyboard.use([KeyHandler({code, event, on_keypressed: cb1})]);
		keyboard.use([KeyHandler({code, event, on_keypressed: cb2})]);
		document.dispatchEvent(new KeyboardEvent('keypress', {keyCode: code}));
		expect(cb1).to.not.have.been.called;
		expect(cb2).to.have.been.called;
	});
});

describe('keyboard.use(null)', () => {
	const event = 'event';
	const code = keyboard.KEY_A;
	const on_keydown = sinon.spy();
	const on_keyup = sinon.spy();
	const on_keypressed = sinon.spy();

	beforeEach(() => {
		const document = jsdom.jsdom();
		global.document = document;
		global.KeyboardEvent = document.defaultView.KeyboardEvent;
		on_keypressed.reset();
	});

	it('removes any previously used handlers', () => {
		keyboard.use([KeyHandler({code, event, on_keypressed})]);
		keyboard.use(null);
		document.dispatchEvent(new KeyboardEvent('keypress', {keyCode: code}));
		expect(on_keypressed).to.not.have.been.called;

		keyboard.use([KeyHandler({code, event, on_keydown, on_keyup})]);
		keyboard.use(null);
		document.dispatchEvent(new KeyboardEvent('keydown', {keyCode: code}));
		expect(on_keydown).to.not.have.been.called;
		document.dispatchEvent(new KeyboardEvent('keyup', {keyCode: code}));
		expect(on_keyup).to.not.have.been.called;
	});
});

describe('keyboard.KEY_ENTER', () => {
	it('is a number', () => {
		expect(keyboard.KEY_ENTER).to.be.a('number');
	});
});

describe('keyboard.KEY_SPACE', () => {
	it('is a number', () => {
		expect(keyboard.KEY_SPACE).to.be.a('number');
	});
});

describe('keyboard.KEY_LEFT', () => {
	it('is a number', () => {
		expect(keyboard.KEY_LEFT).to.be.a('number');
	});
});

describe('keyboard.KEY_UP', () => {
	it('is a number', () => {
		expect(keyboard.KEY_UP).to.be.a('number');
	});
});

describe('keyboard.KEY_RIGHT', () => {
	it('is a number', () => {
		expect(keyboard.KEY_RIGHT).to.be.a('number');
	});
});

describe('keyboard.KEY_DOWN', () => {
	it('is a number', () => {
		expect(keyboard.KEY_DOWN).to.be.a('number');
	});
});

describe('keyboard.KEY_0', () => {
	it('is a number', () => {
		expect(keyboard.KEY_0).to.be.a('number');
	});
});

describe('keyboard.KEY_1', () => {
	it('is a number', () => {
		expect(keyboard.KEY_1).to.be.a('number');
	});
});

describe('keyboard.KEY_2', () => {
	it('is a number', () => {
		expect(keyboard.KEY_2).to.be.a('number');
	});
});

describe('keyboard.KEY_3', () => {
	it('is a number', () => {
		expect(keyboard.KEY_3).to.be.a('number');
	});
});

describe('keyboard.KEY_4', () => {
	it('is a number', () => {
		expect(keyboard.KEY_4).to.be.a('number');
	});
});

describe('keyboard.KEY_5', () => {
	it('is a number', () => {
		expect(keyboard.KEY_5).to.be.a('number');
	});
});

describe('keyboard.KEY_6', () => {
	it('is a number', () => {
		expect(keyboard.KEY_6).to.be.a('number');
	});
});

describe('keyboard.KEY_7', () => {
	it('is a number', () => {
		expect(keyboard.KEY_7).to.be.a('number');
	});
});

describe('keyboard.KEY_8', () => {
	it('is a number', () => {
		expect(keyboard.KEY_8).to.be.a('number');
	});
});

describe('keyboard.KEY_9', () => {
	it('is a number', () => {
		expect(keyboard.KEY_9).to.be.a('number');
	});
});

describe('keyboard.KEY_A', () => {
	it('is a number', () => {
		expect(keyboard.KEY_A).to.be.a('number');
	});
});

describe('keyboard.KEY_B', () => {
	it('is a number', () => {
		expect(keyboard.KEY_B).to.be.a('number');
	});
});

describe('keyboard.KEY_C', () => {
	it('is a number', () => {
		expect(keyboard.KEY_C).to.be.a('number');
	});
});

describe('keyboard.KEY_D', () => {
	it('is a number', () => {
		expect(keyboard.KEY_D).to.be.a('number');
	});
});

describe('keyboard.KEY_E', () => {
	it('is a number', () => {
		expect(keyboard.KEY_E).to.be.a('number');
	});
});

describe('keyboard.KEY_F', () => {
	it('is a number', () => {
		expect(keyboard.KEY_F).to.be.a('number');
	});
});

describe('keyboard.KEY_G', () => {
	it('is a number', () => {
		expect(keyboard.KEY_G).to.be.a('number');
	});
});

describe('keyboard.KEY_H', () => {
	it('is a number', () => {
		expect(keyboard.KEY_H).to.be.a('number');
	});
});

describe('keyboard.KEY_I', () => {
	it('is a number', () => {
		expect(keyboard.KEY_I).to.be.a('number');
	});
});

describe('keyboard.KEY_J', () => {
	it('is a number', () => {
		expect(keyboard.KEY_J).to.be.a('number');
	});
});

describe('keyboard.KEY_K', () => {
	it('is a number', () => {
		expect(keyboard.KEY_K).to.be.a('number');
	});
});

describe('keyboard.KEY_L', () => {
	it('is a number', () => {
		expect(keyboard.KEY_L).to.be.a('number');
	});
});

describe('keyboard.KEY_M', () => {
	it('is a number', () => {
		expect(keyboard.KEY_M).to.be.a('number');
	});
});

describe('keyboard.KEY_N', () => {
	it('is a number', () => {
		expect(keyboard.KEY_N).to.be.a('number');
	});
});

describe('keyboard.KEY_O', () => {
	it('is a number', () => {
		expect(keyboard.KEY_O).to.be.a('number');
	});
});

describe('keyboard.KEY_P', () => {
	it('is a number', () => {
		expect(keyboard.KEY_P).to.be.a('number');
	});
});

describe('keyboard.KEY_Q', () => {
	it('is a number', () => {
		expect(keyboard.KEY_Q).to.be.a('number');
	});
});

describe('keyboard.KEY_R', () => {
	it('is a number', () => {
		expect(keyboard.KEY_R).to.be.a('number');
	});
});

describe('keyboard.KEY_S', () => {
	it('is a number', () => {
		expect(keyboard.KEY_S).to.be.a('number');
	});
});

describe('keyboard.KEY_T', () => {
	it('is a number', () => {
		expect(keyboard.KEY_T).to.be.a('number');
	});
});

describe('keyboard.KEY_U', () => {
	it('is a number', () => {
		expect(keyboard.KEY_U).to.be.a('number');
	});
});

describe('keyboard.KEY_V', () => {
	it('is a number', () => {
		expect(keyboard.KEY_V).to.be.a('number');
	});
});

describe('keyboard.KEY_W', () => {
	it('is a number', () => {
		expect(keyboard.KEY_W).to.be.a('number');
	});
});

describe('keyboard.KEY_X', () => {
	it('is a number', () => {
		expect(keyboard.KEY_X).to.be.a('number');
	});
});

describe('keyboard.KEY_Y', () => {
	it('is a number', () => {
		expect(keyboard.KEY_Y).to.be.a('number');
	});
});

describe('keyboard.KEY_Z', () => {
	it('is a number', () => {
		expect(keyboard.KEY_Z).to.be.a('number');
	});
});
