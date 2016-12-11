import ui from 'ui';

import Grid from 'graphics/grid';
import Scene from 'graphics/scene';

import Brick from 'game/brick';

import Vector from 'maths/vector';
import Rect from 'maths/rect';

import clamp from 'lodash.clamp';
import is_nil from 'lodash.isnil';
import throttle from 'lodash.throttle';

const screen = ui.screen;

const editor = document.getElementById('screen');

const editor_bg_color = 'hsl(210, 50%, 13%)';
const editor_grid1_color = 'hsl(210, 50%, 25%)';
const editor_grid2_color = 'hsl(210, 50%, 33%)';
const mouse_drop_mark_color = 'hsl(210, 50%, 50%)';

screen.size = {
	width: 224*2,
	height: 256*2
};

const scale = Math.round((screen.width/14)/2);

const columns = screen.width/scale;
const rows = screen.height/scale;

const scene = Scene(screen, screen.rect.scale(1/scale), scale, editor_bg_color);
const bricks = [];

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
	const mouse_drop_mark = {
		render() {
			const {screen} = scene;
			screen.save();
			screen.translate(position);
			screen.brush = mouse_drop_mark_color;
			screen.fillRect(Rect(Vector.Null, size));
			screen.restore();
		},
		get position() {
			return position;
		},
		set position(p) {
			position = p;
		}
	};
	scene.add(mouse_drop_mark);
	return mouse_drop_mark;
}

let mouse_drop_mark;

editor.addEventListener('mousemove', throttle(ev => {
	const pos = event_coordinate(ev);
	if (!is_nil(mouse_drop_mark)) {
		mouse_drop_mark.position = pos;
	}
	render();
}, 64));
editor.addEventListener('mouseenter', ev => {
	const pos = event_coordinate(ev);
	mouse_drop_mark = MouseDropMark(pos, {width: 2, height: 1}, scene);
	render();
});
editor.addEventListener('mouseleave', () => {
	scene.remove(mouse_drop_mark);
	mouse_drop_mark = null;
	render();
});
editor.addEventListener('click', ev => {
	const pos = event_coordinate(ev);
	bricks.push(Brick(pos, 'red', 1, scene));
	render();
});

render();
