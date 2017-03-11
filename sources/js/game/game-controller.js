import {dispatch} from 'common/functional';

import Ball from 'game/ball';
import Vaus from 'game/vaus';
import CreateWalls from 'game/wall';
import Coordinates from 'graphics/Coordinates';
import gameKeyboardController from 'game/keyboard-controller';

import Scene from 'graphics/scene';

import {bounce} from 'physics/collisions';

import Vector from 'maths/vector';

import soundController  from 'sound/arkanoid/sound-controller';

import keyboard from 'ui/keyboard';


import cond from 'lodash.cond';
import is_nil from 'lodash.isnil';
import matches from 'lodash.matches';
import random from 'lodash.random';
import remove from 'lodash.remove';

export default function GameController({model, gameView}) {
	const scene = gameView.scene();
	const screen = gameView.screen();
	const gameScene = Scene(Coordinates({
		width: scene.width() - 2,
		height: scene.height() - 1
	}, {x: 1, y: 1}));
	const gameZone = gameScene.localRect();

	const ball = Ball(Vector.Null);
	const vaus = Vaus({x: 1, y: gameScene.height() - 2});

	let bricks = [];
	let paused = false;
	let running = false;

	//////////////////////////////////////////////////////////////////////////

	function ball_neighborhood() {
		const pos = ball.position();
		const col = Math.round(pos.x);
		const row = Math.round(pos.y);
		return bricks.filter(brick => {
			const brick_pos = brick.position();
			return Math.abs(col - brick_pos.x) <= 2 && Math.abs(row - brick_pos.y) <= 1;
		});
	}

	function bricks_remaining() {
		return bricks.reduce(
			(count, brick) => brick.color === 'gold' ? count : count + 1,
			0
		);
	}

	// Collision helpers

	function ball_collides_with_bricks(ball_box, speed) {
		for (let brick of ball_neighborhood(ball)) {
			const brick_box = brick.rect();
			const v = bounce(ball_box, speed, brick_box, .001);
			if (!is_nil(v)) {
				ball.emit('hit', 'brick');
				brick.hit();
				return v.add({
					x: random(-1, 1, true)/1000,
					y: random(-1, 1, true)/1000
				}).toUnit().mul(.2);
			}
		}
	}

	function ball_collides_with_vaus(ball_box, speed) {
		const v = bounce(ball_box, speed, vaus.rect(), 1/16);
		if (!is_nil(v)) {
			ball.emit('hit', 'vaus');
			return v;
		}
	}

	function ball_collides_with_walls(ball_box, speed) {
		if (ball_box.leftX <= gameZone.leftX) {
			ball.emit('hit', 'wall');
			// collide with left wall
			return Vector({x: -speed.x, y: speed.y});
		} else if (ball_box.rightX >= gameZone.rightX) {
			ball.emit('hit', 'wall');
			// collide with right wall
			return Vector({x: -speed.x, y: speed.y});
		} else if (ball_box.topY <= gameZone.topY) {
			// collide with roof
			ball.emit('hit', 'wall');
			return Vector({x: speed.x, y: -speed.y});
		}
	}

	function ball_goes_out(ball_box, speed) {
		if (ball_box.bottomY >= gameZone.bottomY) {
			if(model.cheatMode()) {
				ball.emit('hit', 'wall');
				return Vector({x: speed.x, y: -speed.y});
			} else {
				ball.emit('hit', 'ground');
				return Vector.Null;
			}
		}
	}

	const ball_collides = dispatch(
		ball_collides_with_bricks,
		ball_collides_with_vaus,
		ball_collides_with_walls,
		ball_goes_out
	);

	//////////////////////////////////////////////////////////////////////////

	function reset_ball_position() {
		const vaus_box = vaus.rect();
		ball.reset(vaus_box.center.sub({
			x: ball.size().width/2,
			y: ball.size().height + vaus_box.height/2
		}));
	}

	function reset_vaus_position() {
		vaus.reset({x: 1, y: gameZone.height - 2});
	}

	function updateBall() {
		if (!ball.velocity().isNull()) {
			const ball_box = ball.rect().translate(ball.velocity());
			const ball_speed = ball_collides(ball_box, ball.velocity());
			if (!is_nil(ball_speed)) {
				ball.setVelocity(ball_speed);
			}
		} else {
			reset_ball_position(vaus, ball);
		}
		ball.update();
	}

	function updateVaus() {
		const {leftX: vaus_left_x, rightX: vaus_right_x} = vaus.rect();
		const {leftX: zone_left_x, rightX: zone_right_x} = gameScene.localRect();

		if (!vaus.velocity().isNull() && vaus_left_x <= zone_left_x) {
			vaus.move(Vector.Null);
			vaus.setPosition(vaus.position().add({x: zone_left_x - vaus_left_x, y: 0}));
		}

		if (!vaus.velocity().isNull() && vaus_right_x >= zone_right_x) {
			vaus.move(Vector.Null);
			vaus.setPosition(vaus.position().add({x: zone_right_x - vaus_right_x, y: 0}));
		}

		vaus.update();
	}

	function update() {
		if (!paused) {
			updateBall();
			updateVaus();
		}
	}

	function reset(stage) {
		bricks.forEach(brick => {
			brick
				.removeAllListeners('destroyed')
				.removeAllListeners('hit')
				.hide();
		});
		bricks = model.bricks(stage);
		bricks.forEach(brick => {
			brick
				.on('hit', model.updateScore)
				.once('destroyed', () => {
					brick.removeAllListeners().hide();
					remove(bricks, brick);
					const remain = bricks_remaining();
					if (remain === 0) {
						// TODO
						// emitter.emit('end-of-level');
					}
				});
		});
		gameScene.reset().add(...bricks, ball, vaus);
	}

	function loop() {
		if (running) {
			update();
			screen.render();
			requestAnimationFrame(loop);
		}
	}

	function togglePause() {
		if (paused) {
			ball.show();
			vaus.show();
		} else {
			ball.hide();
			vaus.hide();
		}
		paused = !paused;
	}

	function start() {
		keyboard.use(null);
		togglePause();
		if (model.lifeCount() > 0) {
			if (!running) {
				running = true;
				loop();
			}
			setTimeout(() => {
				reset_vaus_position();
				togglePause();
				model.takeLife();
				keyboard.use(gameKeyboardController);
			}, 2000);
		} else {
			running = false;
		}
	}

	keyboard
		.on('direction-changed', direction => {
			vaus.move(direction)
		})
		.on('pause', togglePause)
		.on('fire', () => {
			if (ball.velocity().isNull()) {
				ball.setVelocity(Vector({x: 1, y: -1}).toUnit().mul(.2));
			}
		});
	ball
		.on('hit', cond([
			[matches('brick'), soundController.ballCollidesWithBricks],
			[matches('vaus'), soundController.ballCollidesWithVaus],
			[matches('ground'), () => {
				soundController.ballGoesOut();
				start();
			}]
		]));
	scene.add(...CreateWalls(scene.width() - 1, scene.height()), gameScene);

	return {
		pause() {
			togglePause();
			return this;
		},
		run(stage) {
			reset(stage);
			start();
			return this;
		}
	};
}
