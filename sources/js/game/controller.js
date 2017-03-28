import {dispatch, matcher} from 'common/functional';

import gameKeyboardController from 'game/keyboard-controller';
import Ball from 'game/entities/ball';
import Vaus from 'game/entities/vaus';
import Level  from 'game/level';
import CreateWalls from 'game/entities/wall';
import GameModel from 'game/model';

import Coordinates from 'graphics/coordinates';
import Scene from 'graphics/scene';

import {bounce} from 'physics/collisions';

import Vector from 'maths/vector';

import soundController  from 'sound/arkanoid/sound-controller';

import cond from 'lodash.cond';
import is_nil from 'lodash.isnil';
import random from 'lodash.random';

export default function GameController({model, view, keyboard}) {
	const scene = view.scene();
	const screen = view.screen();
	const gameScene = Scene(Coordinates({
		width: scene.width() - 2,
		height: scene.height() - 1
	}, {x: 1, y: 1}));
	const gameZone = gameScene.localRect();
	const brickScene = Scene(Coordinates(gameZone.size), Vector.Null);
	const level = Level();
	const ball = Ball(Vector.Null);
	const vaus = Vaus({x: 1, y: gameScene.height() - 2});

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
		if (model.isRunning()) {
			update_ball();
			update_vaus();
		}
	}

	//////////////////////////////////////////////////////////////////////////
	// Game state helpers

	function loop() {
		update();
		screen.render();
		requestAnimationFrame(loop);
	}

	ball
		.on('hit', cond([
			[matcher('brick'), soundController.ballCollidesWithBricks],
			[matcher('vaus'), soundController.ballCollidesWithVaus],
			[matcher('ground'), () => {
				soundController.ballGoesOut();
				if (model.lifeCount() > 0) {
					model.setState(GameModel.state.Ready);
				} else {
					model.setState(GameModel.state.GameOver);
				}
			}]
		]));
	keyboard
		.on('direction-changed', direction => {
			vaus.move(direction)
		})
		.on('pause', () => {
			model.setState(GameModel.state.Paused);
		})
		.on('fire', () => {
			if (ball.velocity().isNull()) {
				ball.setVelocity(Vector({x: 1, y: -1}).toUnit().mul(.2));
			}
		});
	model
		.on('reset', () => {
			level.reset();
			brickScene.reset();
			ball.hide();
			vaus.hide();
		})
		.on('changed', cond([
			[matcher('stage'), () => {
				level.reset(model.bricks());
				brickScene.reset().add(...level);
			}],
			[matcher('state', GameModel.state.Paused), () => {
				ball.hide();
				vaus.hide();
			}],
			[matcher('state', GameModel.state.Ready), () => {
				keyboard.use(null);
				ball.show();
				vaus.show();
				model.takeLife();
				reset_vaus_position();
				reset_ball_position();
			}],
			[matcher('state', GameModel.state.Running), () => {
				keyboard.use(gameKeyboardController);
				ball.show();
				vaus.show();
				if (ball.velocity().isNull()) {
					ball.setVelocity(Vector({x: 1, y: -1}).toUnit().mul(.2));
				}
			}]
		]));
	level
		.on('itemChanged', brick => {
			const points = brick.points();
			if (points > 0) {
				model.updateScore(points);
			}
		})
		.on('itemDestroyed', brick => {
			brick.hide();
		})
		.on('completed', () => {
			if (model.isRunning()) {
				ball.hide();
				vaus.hide();
				model.gainLife();
				model.nextStage();
				model.setState(GameModel.state.Ready);
			}
		});

	vaus.hide();
	ball.hide();
	gameScene.add(brickScene, ball, vaus);
	scene.add(...CreateWalls(scene.width() - 1, scene.height()), gameScene);

	return {
		run() {
			loop();
			return this;
		}
	};
}
