// import Screen from 'screen';
// import Rect from 'rect';
import Vector from 'vector';
import Brick from 'brick';
import Vaus from 'vaus';
import ui from 'ui';

import constant from 'lodash.constant';

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
]

function createBricks(cols, rows) {
	const bricks = [];
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			bricks.push(Brick(colors[row], {x: col*2, y: row}, ui.screen));
		}
	}
	return bricks;
}

const bricks = createBricks(13, 7);

const vaus = Vaus({x:0, y:0}, ui.screen);
let speed = Vector.Null;

function draw(screen) {
	screen.save();

	screen.brush = '#444';
	screen.clear();
	screen.translate({x: (screen.width/14)/2, y: 4*(screen.width/14)/2});

	for (let brick of bricks) {
		brick.draw();
	}
	screen.restore();
	screen.save();
	screen.translate({x: screen.width/2, y: screen.height/2});
	vaus.draw();
	screen.restore();
}

function loop() {
	vaus.move(speed||Vector.NULL);
	draw(ui.screen);
	requestAnimationFrame(loop);
}

let left_pressed = false;
let right_pressed = false;

const keyboard = ui.Keyboard([
	ui.Keyboard.createKeyHandler({
		code: ui.Keyboard.LEFT_ARROW_KEY,
		event: 'direction-changed',
		on_keydown: () => {
			left_pressed = true;
			return Vector.Left;
		},
		on_keyup: () => {
			left_pressed = false;
			if (right_pressed) {
				return Vector.Right;
			}
			return Vector.Null;
		},
		repeat: false
	}),
	ui.Keyboard.createKeyHandler({
		code: ui.Keyboard.RIGHT_ARROW_KEY,
		event: 'direction-changed',
		on_keydown: () => {
			right_pressed = true;
			return Vector.Right;
		},
		on_keyup: () => {
			right_pressed = false;
			if (left_pressed) {
				return Vector.Left;
			}
			return Vector.Null;
		},
		repeat: false
	}),
	ui.Keyboard.createKeyHandler({
		code: ui.Keyboard.SPACE_BAR_KEY,
		event: 'fire',
		on_keydown: constant(true),
		on_keyup: constant(false)
	})
]);

keyboard.on('direction-changed', direction => {
	speed = direction;
});
keyboard.start();

requestAnimationFrame(loop);
