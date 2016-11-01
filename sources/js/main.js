import Screen from 'screen';
import Rect from 'rect';

const canvas = document.querySelector('#screen');
const screen = Screen(canvas.getContext('2d'));

screen.toggleSnap(true);
screen.size = {
	width: 224*2,
	height: 256*2
};

function createBricks(cols, rows) {
	const bricks = [];
	const width = ((screen.width - 1)/cols);
	const height = width/2;
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			bricks.push(Rect({x: col*width, y: row*height}, {width, height}));
		}
	}
	return bricks;
}

const bricks = createBricks(13, 6);

function drawBrick(brick) {
	screen.save();

	// screen.scale(1/brick.width);
	// screen.pen = 1/devicePixelRatio;

	screen.pen = 'black';
	screen.brush = '#bad455';

	screen.fillRect(brick);
	screen.drawRect(brick);
	screen.restore();
}

function draw() {

	screen.save();
	screen.brush = '#fff';
	screen.clear();
	screen.restore();

	let i = 0;

	for (let brick of bricks) {
		if (i % 2 === 0)
			drawBrick(brick);
		i++;
	}

	requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
