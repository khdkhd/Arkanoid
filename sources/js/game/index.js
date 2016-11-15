import {dispatch} from 'common/functional';
import {bounce} from 'physics';
import Rect from 'maths/rect';
import Vector from 'maths/vector';
import Brick from 'game/brick';
import Ball from 'game/ball';
import Vaus from 'game/vaus';
import {
	HorizontalWall,
	HorizontalLeftWall,
	HorizontalRightWall,
	VerticalLeftWall,
	VerticalRightWall,
	VerticalTopLeftWall,
	VerticalTopRightWall
} from 'game/wall';
import ui from 'ui';
import gameKeyboardController from 'game/keyboard-controller';

import random from 'lodash.random';
import remove from 'lodash.remove';
import is_nil from 'lodash.isnil';

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

function create_ball(vaus, scale_factor) {
	const vaus_box = vaus.bbox;
	return Ball({x: vaus_box.center.x, y: vaus_box.topY - Ball.Radius}, scale_factor);
}

function create_bricks(cols, rows, scale) {
	const bricks = [];
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			bricks.push(Brick(colors[row], {x: col*2, y: row}, scale));
		}
	}
	return bricks;
}

function create_walls(cols, rows) {
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

	const walls = create_walls(columns - 1, rows);
	const bricks = create_bricks((columns - 2)/2, 7, scale_factor);
	const vaus = Vaus({x: 1, y: zone.height - 2}, scale_factor);

	let ball = create_ball(vaus, scale_factor);
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

	bricks.forEach(brick => {
		// brick.on('hit', (id, point) => {
		// });
		brick.once('destroyed', (id) => {
			brick.removeAllListeners();
			remove(bricks, brick => {
				return brick.id === id;
			});
		});
	});

	// Position helpers

	function ball_neighborhood(ball) {
		const col = Math.round(ball.pos.x);
		const row = Math.round(ball.pos.y);
		return bricks
			.filter(brick => Math.abs(col - brick.pos.x) <= 2 && Math.abs(row - brick.pos.y) <= 1);
	}

	// Collision helpers

	function ball_collides_with_bricks(ball_box, speed) {
		for (let brick of ball_neighborhood(ball)) {
			const v = bounce(ball_box, speed, brick.bbox, .001);
			if (!is_nil(v)) {
				brick.hit();
				return v.add({x: random(-1, 1, true)/1000, y: random(-1, 1, true)/1000}).toUnit().mul(.2);
			}
		}
	}

	function ball_collides_with_vaus(ball_box, speed) {
		const v = bounce(ball_box, speed, vaus.bbox, 1/scale_factor);
		if (!is_nil(v)) {
			return v;
		}
	}

	function ball_collides_with_walls(ball_box, speed) {
		if (ball_box.leftX <= zone.leftX) {
			// collide with left wall
			return Vector({x: -speed.x, y: speed.y});
		} else if (ball_box.rightX >= zone.rightX) {
			// collide with right wall
			return Vector({x: -speed.x, y: speed.y});
		} else if (ball_box.topY <= zone.topY) {
			// collide with roof
			return Vector({x: speed.x, y: -speed.y});
		} else if (ball_box.bottomY >= zone.bottomY) {
			// collide width floor
			// it should only happened if end of round has not been checked
			return Vector({x: speed.x, y: -speed.y});
		}
	}

	const ball_collides = dispatch(
		ball_collides_with_bricks,
		ball_collides_with_vaus,
		ball_collides_with_walls,
		(ball_box, speed) => speed
	);

	// Move helpers

	function move_ball() {
		if (!ball_speed.isNull()) {
			const ball_box = ball.bbox.translate(ball_speed);
			if (ball_box.bottomY >= zone.bottomY) {
				ball_speed = Vector.Null;
				ball = create_ball(vaus, scale_factor);
			} else {
				ball_speed = ball_collides(ball_box, ball_speed);
				ball.move(ball_speed);
			}
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

		screen.pen = {
			strokeStyle: 'hsl(210, 50%, 50%)',
			lineWidth: 1/scale_factor
		};
		screen.translate({x: 0, y: .5/scale_factor});
		screen.drawLine(zone.bottomLeft.add({x: .5, y: -.75}), zone.bottomRight.add({x: -.5, y: -.75}));

		screen.restore();
	}

	// Game loop

	function loop() {
		draw();
		move_vaus();
		move_ball();
		requestAnimationFrame(loop);
	}

	return {
		start() {
			keyboard.start();
			requestAnimationFrame(loop);
		}
	};
}
