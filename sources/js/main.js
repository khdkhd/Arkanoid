import Screen from 'screen';
import Rect from 'rect';

const canvas = document.querySelector('#screen');
const screen = Screen(canvas.getContext('2d'));

screen.toggleSnap(true);

function createBrick(cols, rows) {
	const bricks = [];
	const width = ((screen.width-1)/cols);
	const height = width/2;
	for (let col = 0; col < cols; col++) {
		for (let row = 0; row < rows; row++) {
			bricks.push(Rect({x: col*width, y: row*height, width, height}));
		}
	}
	return bricks;
}

const bricks = createBrick(20, 10);

function drawBrick(brick) {
	screen.save();

	// screen.scale(1/brick.width);
	// screen.pen = 1/10;

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

	for (let brick of bricks) {
		drawBrick(brick);
	}

	requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
