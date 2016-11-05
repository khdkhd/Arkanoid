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

function createBricks(cols, rows) {
	const bricks = [];
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			bricks.push(Brick(colors[row], {x: col*2, y: row}, screen));
		}
	}
	return bricks;
}

export default function createGame() {
	const scale_factor = (ui.screen.width/14)/2;

	const keyboard = ui.Keyboard(gameKeybordDriver);
	const vaus = Vaus({x: 0, y: 0}, scale_factor/2);

	let vaus_speed = Vector.Null;

	keyboard.on('direction-changed', direction => {
		vaus_speed = direction;
	});

	function draw() {
		ui.screen.brush = '#444';
		ui.screen.save();
		ui.screen.clear();
		ui.screen.scale(scale_factor);
		ui.screen.translate({x: 1, y: 1});

		ui.screen.scale(2);

		// for (let brick of bricks) {
		// 	brick.draw();
		// }
		ui.screen.save();
		ui.screen.translate({x: 10, y: 10});
		vaus.draw(ui.screen);
		ui.screen.restore();

		ui.screen.restore();
		//const bricks = createBricks(13, 7);

	}

	function loop() {
		vaus.move(vaus_speed);
		draw();
		//requestAnimationFrame(loop);
	}


	return {
		start() {
			keyboard.start();
			requestAnimationFrame(loop);
		}
	};
}
