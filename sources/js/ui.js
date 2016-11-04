import EventEmitter from 'events';

import Keyboard from 'keyboard';
import Screen from 'screen';

const canvas = document.querySelector('#screen');
const screen = Screen(canvas.getContext('2d'));

screen.size = {
	width: 224*2,
	height: 256*2
};

const ui = Object.assign(Object.create(new EventEmitter()), {
	Keyboard,
	screen,
});

export default ui;
