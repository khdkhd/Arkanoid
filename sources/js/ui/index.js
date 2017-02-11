import EventEmitter from 'events';

import keyboard from 'ui/keyboard';
import LifesView from 'ui/lifes-view';
import ScoreView from 'ui/score-view';
import Screen from 'graphics/screen';

const canvas = document.querySelector('#screen');
const screen = Screen(canvas.getContext('2d'));
const lifes = LifesView({el: document.querySelector('#lifes')});
const score = ScoreView({el: document.querySelector('#score')});

const ui = Object.assign(Object.create(new EventEmitter()), {
	keyboard,
	lifes,
	score,
	screen,
});

export default ui;
