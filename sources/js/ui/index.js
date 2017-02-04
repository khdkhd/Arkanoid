import EventEmitter from 'events';

import keyboard from 'ui/keyboard';
import LifesView from 'ui/lifes-view';
import Screen from 'graphics/screen';

const canvas = document.querySelector('#screen');
const screen = Screen(canvas.getContext('2d'));
const lifes = LifesView({el: document.querySelector('#lifes')});

const ui = Object.assign(Object.create(new EventEmitter()), {
	keyboard,
	screen,
	lifes
});

export default ui;
