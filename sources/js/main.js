import createScreen from 'screen';

const canvas = document.querySelector('#screen');
const screen = createScreen(canvas.getContext('2d'));

screen.toggleSnap(true);

function draw() {
	screen.pen = {
		lineWidth: 1.,
		strokeStyle: '#000'
	};
	screen.brush = '#fff';
	screen.clear();
	screen.brush = 'blue';
	screen.fillRect({
		x: 10,
		y: 10,
		width: 128,
		height: 128
	});

	requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
