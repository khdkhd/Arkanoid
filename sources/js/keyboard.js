import cond from 'lodash.cond';
import is_nil from 'lodash.isnil';
import EventEmitter from 'events';

function create_key_handler({
	code,
	event,
	on_keydown,
	on_keyup,
	repeat = true}) {
	let pressed = false;
	return {
		code,
		keydown(arg) {
			if (!pressed || repeat) {
				pressed = true;
				const data = on_keydown(arg);
				return Object.assign({event}, is_nil(data) ? {} : {data});
			}
		},
		keyup(arg) {
			pressed = false;
			const data = on_keyup(arg);
			return Object.assign({event}, is_nil(data) ? {} : {data});
		}
	}
}

function keydown_handler(key_handlers, keyboard) {
	const handle = cond(key_handlers.map(handler => [
		key => key === handler.code,
		handler.keydown
	]));
	return ev => {
		const event_data = handle(ev.keyCode);
		if (!is_nil(event_data)) {
			keyboard.emit(event_data.event, event_data.data);
			ev.preventDefault();
			ev.stopPropagation();
		}
	};
}

function keyup_handler(key_handlers, keyboard) {
	const handle = cond(key_handlers.map(handler => [
		key => key === handler.code,
		handler.keyup
	]));
	return ev => {
		const event_data = handle(ev.keyCode);
		if (!is_nil(event_data)) {
			keyboard.emit(event_data.event, event_data.data);
			ev.preventDefault();
			ev.stopPropagation();
		}
	}
}

export default function Keyboard(handlers) {
	let keydown_event_handler;
	let keydup_event_handler;
	return Object.assign(
		new EventEmitter(),
		{
			start() {
				keydown_event_handler = keydown_handler(handlers, this)
				keydup_event_handler = keyup_handler(handlers, this)
				document.addEventListener('keydown', keydown_event_handler);
				document.addEventListener('keyup', keydup_event_handler);
			},
			stop() {
				document.removeEventLisstener(keydown_event_handler);
				document.removeEventLisstener(keydup_event_handler);
			}
		}
	);
}

Keyboard.createKeyHandler = create_key_handler;
Keyboard.LEFT_ARROW_KEY = 37;
Keyboard.RIGHT_ARROW_KEY = 39;
Keyboard.SPACE_BAR_KEY = 32;
