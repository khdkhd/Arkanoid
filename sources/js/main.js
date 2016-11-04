import Screen from 'screen';
import Rect from 'rect';
import Brick from 'brick';
import ui from 'ui';

const canvas = document.querySelector('#screen');
const screen = Screen(canvas.getContext('2d'));

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


screen.size = {
	width: 224*2,
	height: 256*2
};

function createBricks(cols, rows) {
	const bricks = [];
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			bricks.push(Brick(colors[row], {x: col*2, y: row}, screen));
		}
	}
	return bricks;
}

ui.keyboard.on('direction-changed', direction => {
	console.log(`(${direction.x}, ${direction.y})`);
});
ui.keyboard.on('fire', engaged => {
	console.log(`fire ${engaged ? 'engaged' : 'disengaged'}`);
});

const bricks = createBricks(13, 7);

function draw() {
	screen.save();

	screen.brush = '#444';
	screen.clear();
	screen.translate({x: (screen.width/14)/2, y: 4*(screen.width/14)/2});

	for (let brick of bricks) {
		brick.draw();
	}
	screen.restore();
	// requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
