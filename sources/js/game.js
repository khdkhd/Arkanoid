import Rect from 'rect';
import Vector from 'vector';
import Brick from 'brick';
import Vaus from 'vaus';
import {
	HorizontalWall,
	HorizontalLeftWall,
	HorizontalRightWall,
	VerticalLeftWall,
	VerticalRightWall,
	VerticalTopLeftWall,
	VerticalTopRightWall
} from 'wall';
import ui from 'ui';

import gameKeyboardController from 'game-keyboard-controller'

const colors = [
	'white',
	'orange',
	'cyan',
	'green',
	'red',
	'blue',
	'purple',
	'yellow',
	'gray',
	'gold'
];

function createBricks(cols, rows, scale) {
	const bricks = [];
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			bricks.push(Brick(colors[row], {x: col*2, y: row}, scale));
		}
	}
	return bricks;
}

function createWalls(cols, rows) {
	const walls = [];
	for (let y = 1; y < rows; ++y) {
		walls.push(VerticalLeftWall({x: 0, y}));
		walls.push(VerticalRightWall({x: cols, y}));
	}
	walls.push(VerticalTopLeftWall({x: 0, y: 0}));
	walls.push(VerticalTopRightWall({x: cols, y: 0}));
	for (let x = 1; x < cols; ++x) {
		walls.push(HorizontalWall({x, y: 0}));
	}
	walls.push(HorizontalLeftWall({x: 0, y: 0}));
	walls.push(HorizontalRightWall({x: cols, y: 0}));
	return walls;
}

export default function createGame() {
	const keyboard = ui.Keyboard(gameKeyboardController);
	const screen = ui.screen;

	screen.size = {
		width: 224*2,
		height: 256*2
	};

	const scale_factor = Math.round((screen.width/14)/2);

	const columns = screen.width/scale_factor;
	const rows = screen.height/scale_factor;

	const zone = Rect({x: 0, y: 0}, {width: columns - 2, height: rows - 2});
	const vaus = Vaus({x: 0, y: zone.height - 2}, scale_factor);
	const bricks = createBricks((columns - 2)/2, 7, scale_factor);
	const walls = createWalls(columns - 1, rows);

	let vaus_speed = Vector.Null;

	keyboard.on('direction-changed', direction => {
		vaus_speed = direction.mul(.4);
	});

	// Move helpers

	function move_vaus() {
		const box = vaus.bbox.translate(vaus_speed);
		if (box.topLeft.x > 0 && vaus_speed.x < 0) {
			vaus.move(vaus_speed);
		}
		if (box.topRight.x < zone.width && vaus_speed.x > 0) {
			vaus.move(vaus_speed);
		}
	}

	// Drawing helpers

	function draw_walls() {
		for (let wall of walls) {
			screen.save();
			screen.translate(wall.pos);
			wall.draw(screen);
			screen.restore();
		}
	}

	function draw_bricks() {
		for (let brick of bricks) {
			screen.save();
			screen.translate(brick.pos);
			brick.draw(screen);
			screen.restore();
		}
	}

	function draw_vaus() {
		screen.save();
		screen.translate(vaus.pos);
		vaus.draw(screen);
		screen.restore();
	}

	function draw() {
		screen.brush = '#123';
		screen.clear();
		screen.save();
		screen.scale(scale_factor);
		draw_walls();
		screen.translate({x: 1, y: 1});
		draw_bricks();
		draw_vaus();
		screen.restore();
	}

	// Game loop

	function loop() {
		move_vaus();
		draw();
		requestAnimationFrame(loop);
	}

	return {
		start() {
			keyboard.start();
			requestAnimationFrame(loop);
		}
	};
}
