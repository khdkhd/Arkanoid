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
			.map(handler => [key => key === handler.code, handler.keyup])
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

	let keydown_event_handler;
	let keydup_event_handler;
	let keypress_event_handler;

	const instance = Object.assign(emitter, {
		use(handlers) {
			document.removeEventListener('keydown', keydown_event_handler);
			document.removeEventListener('keyup', keydup_event_handler);
			document.removeEventListener('keypress', keypress_event_handler);

			keydown_event_handler = keydown_handler(handlers, emitter);
			keydup_event_handler = keyup_handler(handlers, emitter);
			keypress_event_handler = keypress_handler(handlers, emitter);

			document.addEventListener('keydown', keydown_event_handler);
			document.addEventListener('keyup', keydup_event_handler);
			document.addEventListener('keypress', keypress_event_handler);
		}
	});

	Object.defineProperties(instance, {
		'LEFT_ARROW_KEY':   {value: 37},
		'RIGHT_ARROW_KEY':  {value: 39},
		'SPACE_BAR_KEY':    {value: 32},
		'createKeyHandler': {value: create_key_handler}
	});

	return instance;
}

export default Keyboard();
