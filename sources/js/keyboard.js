import cond from 'lodash.cond';
import constant from 'lodash.constant';
import is_nil from 'lodash.isnil';

import EventEmitter from 'events';
import Vector from 'vector';

const keyboard = Object.assign(Object.create(new EventEmitter()), {
});

const keyboard_event = cond([
	[key => key === 32, constant(['pause'])],
	[key => key === 37, constant(['direction-changed', Vector({x: -1, y: 0})])],
	[key => key === 39, constant(['direction-changed', Vector({x:  1, y: 0})])]
]);

document.addEventListener('keydown', ev => {
	const event_data = keyboard_event(ev.keyCode);
	if (!is_nil(event_data)) {
		keyboard.emit.apply(keyboard, event_data);
		ev.preventDefault();
		ev.stopPropagation();
	}
});

export default keyboard;
