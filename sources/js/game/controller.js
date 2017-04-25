import {dispatch, matcher} from 'common/functional';

import gameKeyboardController from 'game/keyboard-controller';
import {BrickCollection} from 'game/entities/brick';
import {default as Ball, BallCollection} from 'game/entities/ball';
import {default as Pill, PillCollection} from 'game/entities/pill';
import Vaus from 'game/entities/vaus';
import CreateWalls from 'game/entities/wall';
import GameModel from 'game/model';

import Coordinates from 'graphics/coordinates';
import Scene from 'graphics/scene';

import {bounce, overlap} from 'physics/collisions';

import Vector from 'maths/vector';

import soundController from 'sound/arkanoid/sound-controller';

import cond from 'lodash.cond';
import is_nil from 'lodash.isnil';

export default function GameController({model, view, keyboard}) {
	const scene = view.scene();
	const screen = view.screen();
	const gameScene = Scene(Coordinates({
		width: scene.width() - 2,
		height: scene.height() - 1
	}, {x: 1, y: 1}));
	const gameZone = gameScene.localRect();
	const brickScene = Scene(Coordinates(gameZone.size));
	const bricks = BrickCollection();
	const balls = BallCollection();
	const pills = PillCollection();
	const vaus = Vaus({x: 1, y: gameScene.height() - 2});

	//////////////////////////////////////////////////////////////////////////
	// Collision helpers

	function ball_collides_with_bricks(ball_box, speed) {
		for (let brick of bricks.neighborhood(ball_box.topLeft)) {
			const v = bounce(ball_box, speed, brick.rect(), .001);
			if (!is_nil(v)) {
				return [v, brick];
			}
		}
	}

	function ball_collides_with_vaus(ball_box, speed) {
		const v = bounce(ball_box, speed, vaus.rect(), 1/16);
		if (!is_nil(v)) {
			return [v, vaus];
		}
	}

	function ball_collides_with_walls(ball_box, speed) {
		if (ball_box.leftX <= gameZone.leftX) {
			// collide with left wall
			return [Vector({x: -speed.x, y: speed.y})];
		} else if (ball_box.rightX >= gameZone.rightX) {
			// collide with right wall
			return [Vector({x: -speed.x, y: speed.y})];
		} else if (ball_box.topY <= gameZone.topY) {
			// collide with roof
			return [Vector({x: speed.x, y: -speed.y})];
		}
	}

	function ball_goes_out(ball_box, speed) {
		if (ball_box.bottomY >= gameZone.bottomY) {
			if(model.cheatMode()) {
				return [Vector({x: speed.x, y: -speed.y})];
			}
			return [];
		}
	}

	const ball_collides = dispatch(
		ball_collides_with_bricks,
		ball_collides_with_vaus,
		ball_collides_with_walls,
		ball_goes_out,
		(ball_box, speed) => [speed]
	);

	function pill_collides(pill) {
		const pill_box = pill.rect();
		const o = overlap(pill_box, vaus.rect(), pill.velocity().y);
		if (o !== overlap.NONE || pill_box.topY >= gameZone.bottomY) {
			if (o !== overlap.NONE) {
				vaus.emit('powerUp', pill.type());
			}
			pill.destroy();
		}
	}

	//////////////////////////////////////////////////////////////////////////
	// Position helpers

	const ball_split = balls.splitter(Math.PI/8);

	function reset_ball_position(ball) {
		const vaus_box = vaus.rect();
		ball.setPosition(vaus_box.center.sub({
			x: 0,
			y: vaus_box.height/2 + 2*Ball.Radius
		}));
	}

	function update_ball(ball) {
		if (!ball.velocity().isNull()) {
			const ball_box = ball.rect().translate(ball.velocity());
			const [speed, entity] = ball_collides(ball_box, ball.velocity());
			if (!is_nil(speed)) {
				ball.setVelocity(speed);
				if (!is_nil(entity)) {
					entity.hit();
				}
			} else {
				ball.destroy();
			}
		} else {
			reset_ball_position(ball);
		}
		ball.update();
	}

	function update_pill(pill) {
		pill_collides(pill);
		pill.update();
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
			for (let ball of balls) {
				update_ball(ball);
			}
			for (let pill of pills) {
				update_pill(pill);
			}
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

	bricks
		.on('itemAdded', brick => brickScene.add(brick))
		.on('itemChanged', brick => {
			model.updateScore(brick.points());
			soundController.ballCollidesWithBricks();
		})
		.on('itemDestroyed', brick => {
			brickScene.remove(brick);
			if (model.isRunning()) {
				pills.random(brick.position());
			}
		})
		.on('completed', () => {
			if (model.isRunning()) {
				balls.hide();
				vaus.hide();
				model.gainLife();
				model.nextStage();
				model.setState(GameModel.State.Ready);
			}
		});
	balls
		.on('itemAdded', ball => gameScene.add(ball))
		.on('itemDestroyed', ball => gameScene.remove(ball))
		.on('empty', () => {
			if (model.isRunning()) {
				soundController.ballGoesOut();
				model.setState(model.lifeCount() > 0
					? GameModel.State.Ready
					: GameModel.State.GameOver
				);
			}
		});
	pills
		.on('itemAdded', pill => gameScene.add(pill))
		.on('itemDestroyed', pill => gameScene.remove(pill));
	vaus
		.on('powerUp', cond([
			[matcher(Pill.ExtraLife), () => model.gainLife()],
			[matcher(Pill.Expand), () => vaus.setMode(Vaus.Mode.Large)],
			[matcher(Pill.Laser), () => vaus.setMode(Vaus.Mode.Armed)],
			[matcher(Pill.Split), () => {
				vaus.setMode(Vaus.Mode.Small);
				ball_split();
			}]
		]))
		.on('hit', () => soundController.ballCollidesWithVaus());
	model
		.on('reset', () => {
			bricks.reset();
			brickScene.reset();
			balls.hide();
			vaus.hide();
		})
		.on('changed', cond([
			[matcher('stage'), () => {
				bricks.reset(model.bricks());
			}],
			[matcher('state', GameModel.State.Paused), () => {
				balls.hide();
				vaus.hide();
			}],
			[matcher('state', GameModel.State.Ready), () => {
				keyboard.use(null);
				model.takeLife();
				vaus
					.setMode(Vaus.Mode.Small)
					.reset({x: 1, y: gameZone.height - 2})
					.show();
				balls
					.reset()
					.create(Vector.Null)
					.forEach(reset_ball_position);
				pills.reset();
			}],
			[matcher('state', GameModel.State.Running), () => {
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
	keyboard
		.on('direction-changed', direction => {
			vaus.move(direction)
		})
		.on('pause', () => {
			model.setState(GameModel.State.Paused);
		})
		.on('fire', () => {
			bricks.find(brick => brick.color() !== 'gold').destroy();
			balls.forEach(ball => {
				if (ball.velocity().isNull()) {
					ball.setVelocity(Vector({x: 1, y: -1}).toUnit().mul(.2));
				}
			});
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
