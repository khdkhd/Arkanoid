import cond from 'lodash.cond';
import is_nil from 'lodash.isnil';
import EventEmitter from 'events';

function create_key_handler({
	code,
	event,
	on_keydown,
	on_keyup,
	on_keypressed,
	repeat = true}) {
	let pressed = false;
	const invoke = (handler, arg) => {
		const data = handler(arg);
		return Object.assign({event}, is_nil(data) ? {} : {data});
	}
	const callbacks = Object.assign(is_nil(on_keypressed)
		? {
			keydown(arg) {
				if (!pressed || repeat) {
					pressed = true;
					return invoke(on_keydown, arg);
				}
			},
			keyup(arg) {
				pressed = false;
				return invoke(on_keyup, arg);
			}
		}
		: {keypressed(arg) {return invoke(on_keypressed, arg);}}
	);
	return Object.assign({code}, callbacks);
}

function keydown_handler(key_handlers, emitter) {
	const handle = cond(
		key_handlers
			.filter(handler => !(is_nil(handler.keydown) || is_nil(handler.keyup)))
			.map(handler => [key => key === handler.code, handler.keydown])
		);
	return ev => {
		const event_data = handle(ev.keyCode);
		if (!is_nil(event_data)) {
			emitter.emit(event_data.event, event_data.data);
			ev.preventDefault();
			ev.stopPropagation();
		}
	};
}

function keyup_handler(key_handlers, emitter) {
	const filtered = key_handlers
		.filter(handler => !(is_nil(handler.keydown) || is_nil(handler.keyup)))
		.map(handler => [key => key === handler.code, handler.keyup])
	const handle = cond(filtered);
	return ev => {
		const event_data = handle(ev.keyCode);
		if (!is_nil(event_data)) {
			emitter.emit(event_data.event, event_data.data);
			ev.preventDefault();
			ev.stopPropagation();
		}
	}
}

function keypress_handler(key_handlers, emitter) {
	const handle = cond(
		key_handlers
			.filter(handler => !is_nil(handler.keypressed))
			.map(handler => [key => key === handler.code, handler.keypressed])
	);
	return ev => {
		const event_data = handle(ev.keyCode);
		if (!is_nil(event_data)) {
			emitter.emit(event_data.event, event_data.data);
			ev.preventDefault();
			ev.stopPropagation();
		}
	}
}

export function Keyboard() {
	const emitter = new EventEmitter();
	const state = {
		keydownEventHandler: null,
		keydupEventHandler: null,
		keypressEventHandler: null
	};
	const instance = Object.assign(emitter, {
		use(handlers) {
			document.removeEventListener('keydown', state.keydownEventHandler);
			document.removeEventListener('keyup', state.keydupEventHandler);
			document.removeEventListener('keypress', state.keypressEventHandler);

			state.keydownEventHandler = keydown_handler(handlers, emitter);
			state.keydupEventHandler = keyup_handler(handlers, emitter);
			state.keypressEventHandler = keypress_handler(handlers, emitter);

			document.addEventListener('keydown', state.keydownEventHandler);
			document.addEventListener('keyup', state.keydupEventHandler);
			document.addEventListener('keypress', state.keypressEventHandler);
		}
	});

	Object.defineProperties(instance, {
		'KEY_ENTER': {value: 13},
		'KEY_SPACE': {value: 32},
		'KEY_LEFT':  {value: 37},
		'KEY_UP':    {value: 38},
		'KEY_RIGHT': {value: 39},
		'KEY_DOWN':  {value: 40},
		'KEY_0':     {value: 48},
		'KEY_1':     {value: 49},
		'KEY_2':     {value: 50},
		'KEY_3':     {value: 51},
		'KEY_4':     {value: 52},
		'KEY_5':     {value: 53},
		'KEY_6':     {value: 54},
		'KEY_7':     {value: 55},
		'KEY_8':     {value: 56},
		'KEY_9':     {value: 57},
		'KEY_A':     {value: 97},
		'KEY_B':     {value: 98},
		'KEY_C':     {value: 99},
		'KEY_D':     {value: 100},
		'KEY_E':     {value: 101},
		'KEY_F':     {value: 102},
		'KEY_G':     {value: 103},
		'KEY_H':     {value: 104},
		'KEY_I':     {value: 105},
		'KEY_J':     {value: 106},
		'KEY_K':     {value: 107},
		'KEY_L':     {value: 108},
		'KEY_M':     {value: 109},
		'KEY_N':     {value: 110},
		'KEY_O':     {value: 111},
		'KEY_P':     {value: 112},
		'KEY_Q':     {value: 113},
		'KEY_R':     {value: 114},
		'KEY_S':     {value: 115},
		'KEY_T':     {value: 116},
		'KEY_U':     {value: 117},
		'KEY_V':     {value: 118},
		'KEY_W':     {value: 119},
		'KEY_X':     {value: 120},
		'KEY_Y':     {value: 121},
		'KEY_Z':     {value: 122},

		'createKeyHandler': {value: create_key_handler}
	});

	return instance;
}

export default Keyboard();
