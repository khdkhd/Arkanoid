import {dispatch} from 'common/functional';

import Ball from 'game/ball';
import Vaus from 'game/vaus';
import Level  from 'game/level';
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

export default function GameController({gameModel, gameView}) {
	const scene = gameView.scene();
	const screen = gameView.screen();
	const gameScene = Scene(Coordinates({
		width: scene.width() - 2,
		height: scene.height() - 1
	}, {x: 1, y: 1}));
	const gameZone = gameScene.localRect();
	const brickScene = Scene(Coordinates(gameZone.size), Vector.Null);
	const level = Level();
	const ball = Ball(Vector.Null);
	const vaus = Vaus({x: 1, y: gameScene.height() - 2});

	let paused = false;
	let running = false;

	//////////////////////////////////////////////////////////////////////////
	// Collision helpers

	function ball_collides_with_bricks(ball_box, speed) {
		for (let brick of level.neighborhood(ball.position())) {
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
			if(gameModel.cheatMode()) {
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
	// Position helpers

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

	function update_ball() {
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

	function update_vaus() {
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
			update_ball();
			update_vaus();
		}
	}

	//////////////////////////////////////////////////////////////////////////
	// Game state helpers

	function loop() {
		if (running) {
			update();
			screen.render();
			requestAnimationFrame(loop);
		}
	}

	function reset(stage) {
		level.reset(gameModel.bricks(stage));
		brickScene.reset().add(...level);
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
		if (gameModel.lifeCount() > 0) {
			if (!running) {
				running = true;
				loop();
			}
			setTimeout(() => {
				reset_vaus_position();
				togglePause();
				gameModel.takeLife();
				keyboard.use(gameKeyboardController);
			}, 2000);
		} else {
			running = false;
		}
	}

	ball
		.on('hit', cond([
			[matches('brick'), soundController.ballCollidesWithBricks],
			[matches('vaus'), soundController.ballCollidesWithVaus],
			[matches('ground'), () => {
				soundController.ballGoesOut();
				start();
			}]
		]));

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
	level
		.on('model-changed', (brick) => {
			gameModel.updateScore(brick.points());
		})
		.on('model-destroyed', brick => {
			brick.hide();
		})
		.on('completed', () => {
			gameModel.emit('stage-completed');
		});

	gameScene.add(brickScene, ball, vaus);
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
