import EventEmitter from 'events';

import keyboard from 'ui/keyboard';
import Screen from 'graphics/screen';

const canvas = document.querySelector('#screen');
const screen = Screen(canvas.getContext('2d'));
const lifes = document.querySelector('#lifes');
const score = document.querySelector('#score');

const ui = Object.assign(Object.create(new EventEmitter()), {
	keyboard,
	lifes,
	score,
	screen,
});

export default ui;
