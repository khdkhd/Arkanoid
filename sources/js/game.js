import Vector from 'vector';
import Brick from 'brick';
import Vaus from 'vaus';
import ui from 'ui';

import gameKeybordDriver from 'game-keyboard-driver'

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

export default function createGame() {
	const keyboard = ui.Keyboard(gameKeybordDriver);
	const screen = ui.screen;

	screen.size = {
		width: 224*2,
		height: 256*2
	};

	const scale_factor = Math.round((screen.width/14)/2);
	const columns = screen.width/scale_factor - 2;
	const rows = screen.height/scale_factor - 2;

	const vaus = Vaus({x: 0, y: rows - 1}, scale_factor);
	const bricks = createBricks(columns/2, 7, scale_factor);

	let vaus_speed = Vector.Null;

	keyboard.on('direction-changed', direction => {
		vaus_speed = direction.mul(.4);
	});

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
		screen.translate({x: 1, y: 1});
		draw_bricks();
		draw_vaus();
		screen.restore();
	}

	function loop() {
		vaus.move(vaus_speed);
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
