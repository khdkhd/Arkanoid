import EventEmitter from 'events';
import Keyboard from 'keyboard';

const ui = Object.assign(Object.create(new EventEmitter()), {
	Keyboard,
});

export default ui;
