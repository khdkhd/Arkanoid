import createScreen from 'screen';

const canvas = document.querySelector('#screen');
const screen = createScreen(canvas.getContext('2d'));

screen.toggleSnap(true);

function draw() {

	screen.save();
	screen.brush = '#fff';
	screen.clear();
	screen.restore();

	screen.pen = 'blue';

	screen.pen = 1;
	screen.drawRect({
		x: 10,
		y: 10,
		width: 64,
		height: 64
	});

	screen.pen = 2;
	screen.drawRect({
		x: 80,
		y: 80,
		width: 64,
		height: 64
	});

	screen.pen = 3;
	screen.drawRect({
		x: 160,
		y: 160,
		width: 64,
		height: 64
	});

	requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
