import {dispatch, matcher} from 'common/functional';

import gameKeyboardController from 'game/keyboard-controller';
import {default as Ball, BallCollection} from 'game/entities/ball';
import Vaus from 'game/entities/vaus';
import PowerUp from 'game/entities/power-up';
import Level  from 'game/level';
import CreateWalls from 'game/entities/wall';
import GameModel from 'game/model';

import Coordinates from 'graphics/coordinates';
import Scene from 'graphics/scene';

import {bounce, overlap} from 'physics/collisions';

import Vector from 'maths/vector';

import soundController from 'sound/arkanoid/sound-controller';

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
	const balls = BallCollection();
	// const ball = Ball(Vector.Null);
	const vaus = Vaus({x: 1, y: gameScene.height() - 2});
	const pills = new Set();

	//////////////////////////////////////////////////////////////////////////
	// Collision helpers

	function ball_collides_with_bricks(ball, ball_box, speed) {
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

	function ball_collides_with_vaus(ball, ball_box, speed) {
		const v = bounce(ball_box, speed, vaus.rect(), 1/16);
		if (!is_nil(v)) {
			ball.emit('hit', 'vaus');
			return v;
		}
	}

	function ball_collides_with_walls(ball, ball_box, speed) {
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

	function ball_goes_out(ball, ball_box, speed) {
		if (ball_box.bottomY >= gameZone.bottomY) {
			if(model.cheatMode()) {
				ball.emit('hit', 'wall');
				return Vector({x: speed.x, y: -speed.y});
			} else {
				ball.destroy();
			}
		}
	}

	const ball_collides = dispatch(
		ball_collides_with_bricks,
		ball_collides_with_vaus,
		ball_collides_with_walls,
		ball_goes_out
	);

	const ball_split = balls.splitter(Math.PI/8);

	function pills_collides() {
		for (let pill of pills) {
			const pill_box = pill.rect();
			const o = overlap(pill_box, vaus.rect(), pill.velocity().y);
			if (o !== overlap.NONE || pill_box.topY >= gameZone.bottomY) {
				pills.delete(pill);
				gameScene.remove(pill);
				if (o !== overlap.NONE) {
					vaus.emit('powerUp', pill.type());
				}
			}
		}
	}

	//////////////////////////////////////////////////////////////////////////
	// Position helpers

	function reset_ball_position(ball) {
		const vaus_box = vaus.rect();
		ball.setPosition(vaus_box.center.sub({
			x: 0,
			y: vaus_box.height/2 + 2*Ball.Radius
		}));
	}

	function update_ball() {
		balls.forEach(ball => {
			if (!ball.velocity().isNull()) {
				const ball_box = ball.rect().translate(ball.velocity());
				const ball_speed = ball_collides(ball, ball_box, ball.velocity());
				if (!is_nil(ball_speed)) {
					ball.setVelocity(ball_speed);
				}
			} else {
				reset_ball_position(ball);
			}
			ball.update();
		});
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
			pills_collides();
			for (let pill of pills) {
				pill.update();
			}
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

	balls
		.on('itemAdded', ball => gameScene.add(ball))
		.on('itemDestroyed', ball => gameScene.remove(ball))
		.on('empty', () => {
			if (model.isRunning()) {
				soundController.ballGoesOut();
				model.setState(model.lifeCount() > 0
					? GameModel.state.Ready
					: GameModel.state.GameOver
				);
			}
		})
		.on('hit', cond([
			[matcher('brick'), soundController.ballCollidesWithBricks],
			[matcher('vaus'), soundController.ballCollidesWithVaus]
		]));
	vaus
		.on('powerUp', cond([
			[matcher(PowerUp.ExtraLife), () => model.gainLife()],
			[matcher(PowerUp.Expand), () => vaus.setMode(Vaus.Mode.Large)],
			[matcher(PowerUp.Laser), () => vaus.setMode(Vaus.Mode.Armed)],
			[matcher(PowerUp.Split), () => {
				ball_split();
				vaus.setMode(Vaus.Mode.Small);
			}]
		]))
	keyboard
		.on('direction-changed', direction => {
			vaus.move(direction)
		})
		.on('pause', () => {
			model.setState(GameModel.state.Paused);
		})
		.on('fire', () => {
			balls.forEach(ball => {
				if (ball.velocity().isNull()) {
					ball.setVelocity(Vector({x: 1, y: -1}).toUnit().mul(.2));
				}
			});
		});
	model
		.on('reset', () => {
			level.reset();
			brickScene.reset();
			balls.hide();
			vaus.hide();
		})
		.on('changed', cond([
			[matcher('stage'), () => {
				level.reset(model.bricks());
				brickScene.reset().add(...level);
			}],
			[matcher('state', GameModel.state.Paused), () => {
				balls.hide();
				vaus.hide();
			}],
			[matcher('state', GameModel.state.Ready), () => {
				keyboard.use(null);
				for (let pill of pills) {
					pills.delete(pill);
					gameScene.remove(pill);
				}
				model.takeLife();
				vaus
					.setMode(Vaus.Mode.Small)
					.reset({x: 1, y: gameZone.height - 2})
					.show();
				balls
					.reset()
					.create(Vector.Null)
					.forEach(reset_ball_position);
			}],
			[matcher('state', GameModel.state.Running), () => {
				keyboard.use(gameKeyboardController);
				balls.show();
				vaus.show();
				balls.forEach(ball => {
					if (ball.velocity().isNull()) {
						ball.setVelocity(Vector({x: 1, y: -1}).toUnit().mul(.2));
					}
				});
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
		.on('powerUp', power_up => {
			if (model.isRunning()) {
				gameScene.add(power_up);
				pills.add(power_up);
			}
		})
		.on('completed', () => {
			if (model.isRunning()) {
				balls.hide();
				vaus.hide();
				model.gainLife();
				model.nextStage();
				model.setState(GameModel.state.Ready);
			}
		});

	vaus.hide();
	balls.hide();
	gameScene.add(brickScene, vaus);
	scene.add(...CreateWalls(scene.width() - 1, scene.height()), gameScene);

	return {
		run() {
			loop();
			return this;
		}
	};
}
