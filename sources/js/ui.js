import EventEmitter from 'events';

import keyboard from 'keyboard';

const ui = Object.assign(Object.create(new EventEmitter()), {
	get keyboard() {
		return keyboard;
	}
});

export default ui;
