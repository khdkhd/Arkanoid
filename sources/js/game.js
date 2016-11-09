import Rect from 'rect';
import Vector from 'vector';
import Brick from 'brick';
import Ball from 'ball';
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

function createBall(vaus, scale_factor) {
	const vaus_box = vaus.bbox;
	return Ball({x: vaus_box.center.x, y: vaus_box.topY - Ball.Radius}, scale_factor);
}

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

	const walls = createWalls(columns - 1, rows);
	const bricks = createBricks((columns - 2)/2, 7, scale_factor);
	const vaus = Vaus({x: 1, y: zone.height - 2}, scale_factor);

	let ball = createBall(vaus, scale_factor);
	let vaus_speed = Vector.Null;
	let ball_speed = Vector.Null;

	keyboard.on('direction-changed', direction => {
		vaus_speed = direction.mul(.4);
	});
	keyboard.on('fire', () => {
		if (ball_speed.isNull()) {
			ball_speed = Vector({x: 1, y: -1}).toUnit().mul(.2);
		}
	});

	// Move helpers

	function vaus_ball_collide(vaus_box, ball_box) {
		return vaus_box.intersect(ball_box)
			&& vaus_box.leftX < ball_box.leftX
			&& vaus_box.rightX > ball_box.rightX;
	}

	function move_ball() {
		if (!ball_speed.isNull()) {
			const ball_box = ball.bbox.translate(ball_speed);
			const vaus_box = vaus.bbox;

			if (ball_box.leftX <= zone.leftX) {
				// colide with left wall
				ball_speed = Vector({x: -ball_speed.x, y: ball_speed.y});
			} else if (ball_box.rightX >= zone.rightX) {
				// colide with right wall
				ball_speed = Vector({x: -ball_speed.x, y: ball_speed.y});
			} else if (ball_box.topY <= zone.topY) {
				// collision with roof
				ball_speed = Vector({x: ball_speed.x, y: -ball_speed.y});
			} else if (vaus_ball_collide(vaus_box, ball_box)) {
				ball_speed = Vector({x: ball_speed.x, y: -ball_speed.y});
			} else if (ball_box.bottomY >= zone.bottomY) {
				ball_speed = Vector.Null;
				ball = createBall(vaus);
			}
			ball.move(ball_speed);
		} else {
			ball.move(vaus_speed);
		}
	}

	function move_vaus() {
		const box = vaus.bbox.translate(vaus_speed);
		if (box.topLeft.x > 0 && vaus_speed.x < 0) {
			vaus.move(vaus_speed);
		} else if (box.topRight.x < zone.width && vaus_speed.x > 0) {
			vaus.move(vaus_speed);
		} else {
			vaus_speed = Vector.Null;
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

	function draw_ball() {
		screen.save();
		screen.translate(ball.pos);
		ball.draw(screen);
		screen.restore();
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
		draw_ball();

		screen.restore();
	}

	// Game loop

	function loop() {
		move_vaus();
		move_ball();
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
