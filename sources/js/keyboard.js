import cond from 'lodash.cond';
import constant from 'lodash.constant';
import is_nil from 'lodash.isnil';

import EventEmitter from 'events';
import Vector from 'vector';

const keyboard = Object.assign(Object.create(new EventEmitter()), {
});

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

function keydown_handler(key_handlers) {
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

function keyup_handler(key_handlers) {
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

const LEFT_ARROW_KEY = 37;
const RIGHT_ARROW_KEY = 39;
const SPACE_BAR_KEY = 32;

const keydown_handlers = [
	create_key_handler({
		code: LEFT_ARROW_KEY,
		event: 'direction-changed',
		on_keydown: constant(Vector.Left),
		on_keyup: constant(Vector.Null),
		repeat: false
	}),
	create_key_handler({
		code: RIGHT_ARROW_KEY,
		event: 'direction-changed',
		on_keydown: constant(Vector.Right),
		on_keyup: constant(Vector.Null),
		repeat: false
	}),
	create_key_handler({
		code: SPACE_BAR_KEY,
		event: 'fire',
		on_keydown: constant(true),
		on_keyup: constant(false)
	})
];

document.addEventListener('keydown', keydown_handler(keydown_handlers));
document.addEventListener('keyup', keyup_handler(keydown_handlers));

export default keyboard;
