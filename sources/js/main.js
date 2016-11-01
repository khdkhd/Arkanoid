import Screen from 'screen';
import Rect from 'rect';
import {GrayBrick, BlueBrick, RedBrick, YellowBrick, PurpleBrick, GreenBrick} from 'brick';

const canvas = document.querySelector('#screen');
const screen = Screen(canvas.getContext('2d'));

// screen.toggleSnap(true);
screen.size = {
	width: 224*2,
	height: 256*2
};

function createBricks(cols, rows) {
	const bricks = [];
	const colors = [GrayBrick, RedBrick, YellowBrick, BlueBrick, PurpleBrick, GreenBrick];
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			bricks.push(colors[row]({x: col*2, y: row}, screen));
		}
	}
	return bricks;
}

const bricks = createBricks(13, 6);

function draw() {
	screen.save();

	screen.brush = '#222';
	screen.clear();

	screen.translate({x: (screen.width/14)/2, y: (screen.width/14)/2});

	for (let brick of bricks) {
		brick.draw();
	}
	screen.restore();
	requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
