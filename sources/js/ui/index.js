import EventEmitter from 'events';

import Keyboard from 'ui/keyboard';
import Screen from 'graphism/screen';

const canvas = document.querySelector('#screen');
const screen = Screen(canvas.getContext('2d'));

const ui = Object.assign(Object.create(new EventEmitter()), {
	Keyboard,
	screen,
});

export default ui;
