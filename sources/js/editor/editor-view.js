import {completeAssign} from 'common/utils';
import {EventEmitter} from 'events';

import Grid from 'graphics/grid';
import Scene from 'graphics/scene';

import Vector from 'maths/vector';
import Rect from 'maths/rect';

import ui from 'ui';

import clamp from 'lodash.clamp';
import constant from 'lodash.constant';
import is_nil from 'lodash.isnil';
import is_function from 'lodash.isfunction';
import throttle from 'lodash.throttle';

const emitter = new EventEmitter();

const editor_bg_color = 'hsl(210, 50%, 13%)';
const editor_grid1_color = 'hsl(210, 50%, 25%)';
const editor_grid2_color = 'hsl(210, 50%, 33%)';
const mouse_drop_mark_color = 'hsl(210, 50%, 50%)';

const screen = ui.screen;

const editor = document.getElementById('screen');

screen.size = {
	width: 224*2,
	height: 256*2
};
screen.translate({x: .5, y: .5});

const scale = Math.round((screen.width/14)/2);

const columns = screen.width/scale;
const rows = screen.height/scale;

const scene = Scene(screen, screen.rect.scale(1/scale), scale, editor_bg_color);

Grid(columns,   rows,   1, editor_grid1_color, scene);
Grid(columns/2, rows/2, 2, editor_grid2_color, scene);

function render() {
	scene.render();
}

function event_coordinate(ev) {
	return Vector({
		x: clamp(Math.floor((ev.clientX - ev.target.offsetLeft)/scale - .25), 0, columns - 1),
		y: clamp(Math.floor((ev.clientY - ev.target.offsetTop )/scale - .25), 0, rows - 1)
	});
}

function MouseDropMark(position, size, scene) {
	let display = false;
	const mouse_drop_mark = {
		render() {
			if (display) {
				const {screen} = scene;
				screen.save();
				screen.translate(position);
				screen.brush = mouse_drop_mark_color;
				screen.fillRect(Rect(Vector.Null, size));
				screen.restore();
			}
		},
		get position() {
			return position;
		},
		set position(p) {
			position = p;
		},
		set toggleDisplay(b) {
			display = is_nil(b) ? !display : b;
		}
	};
	scene.add(mouse_drop_mark);
	return mouse_drop_mark;
}

let overlap = constant(false);
const mouse_drop_mark = MouseDropMark({x: 0, y: 0}, {width: 2, height: 1}, scene);
const on_mouse_move = throttle(ev => {
	const pos = event_coordinate(ev);

	mouse_drop_mark.position = pos;
	mouse_drop_mark.toggleDisplay = !overlap(pos);

	render();
}, 64);

editor.addEventListener('mouseenter', () => {
	editor.addEventListener('mousemove', on_mouse_move);
	render();
});
editor.addEventListener('mouseleave', () => {
	mouse_drop_mark.toggleDisplay = false;
	on_mouse_move.cancel();
	editor.removeEventListener('mousemove', on_mouse_move);
	render();
});
editor.addEventListener('click', ev => {
	emitter.emit('click', event_coordinate(ev));
});

export default completeAssign(emitter, {
	get scene() {
		return scene;
	},
	set overlap(fn) {
		if (! is_function(fn)) {
			throw new Error('argument must be a function');
		}
		overlap = fn;
	},
	render
});
