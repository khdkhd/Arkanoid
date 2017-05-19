import {dispatch, matcher} from 'common/functional';

import KeyboardController from 'game/keyboard-controller';
import {BallCollection} from 'game/entities/ball';
import {BrickCollection} from 'game/entities/brick';
import {BulletCollection} from 'game/entities/bullet';
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
import flow from 'lodash.flow';
import is_nil from 'lodash.isnil';

const PILL_BONUS_POINT = 1000;

const BALL_SPEED_MIN = .2;
const BALL_SPEED_MAX = .6;
const BALL_SPEED_STEP = .025;
const BALL_SPEED_INITIAL = .3;
const BALL_TIMEOUT = 1000;

export default function GameController({model, view, keyboard}) {
	const scene = view.scene();
	const screen = view.screen();
	const gameScene = Scene(Coordinates({
		width:  scene.width()  - 2,
		height: scene.height() - 1
	}, {x: 1, y: 1}));
	const gameZone = gameScene.localRect();
	const brickScene = Scene(Coordinates(gameZone.size));
	const bricks = BrickCollection();
	const balls = BallCollection();
	const bullets = BulletCollection();
	const pills = PillCollection();
	const vaus = Vaus({x: 1, y: gameScene.height() - 2});

	let ballXOffset = .5;
	let ballTimeout = null;

	//////////////////////////////////////////////////////////////////////////
	// Ball speed helpers

	function ball_bounce_angle(x_offset, vaus_width) {
		return Math.PI/2*(x_offset)/vaus_width;
	}

	function throw_ball() {
		if (!is_nil(ballTimeout)) {
			clearTimeout(ballTimeout);
			ballTimeout = null;
		}
		balls
			.filter(ball => ball.velocity().isNull())
			.forEach(ball => {
				const teta = ball_bounce_angle(ballXOffset, vaus.rect().width);
				const velocity = Vector({
					x:  Math.sin(teta)*BALL_SPEED_INITIAL,
					y: -Math.cos(teta)*BALL_SPEED_INITIAL
				});
				ball.setVelocity(velocity);
			});
	}

	function slow_down(speed, min, step = BALL_SPEED_STEP) {
		return speed > min
			? Math.max(speed - step, min)
			: speed;
	}

	function speed_up(speed, max, step = BALL_SPEED_STEP) {
		return speed > 0 && speed < max
			? Math.min(speed + step, max)
			: speed;
	}

	//////////////////////////////////////////////////////////////////////////
	// Collision helpers

	function ball_collides_with_bricks(ball_box, velocity) {
		const epsilon = 1/screen.absoluteScale();
		for (let brick of bricks.neighborhood(ball_box.topLeft)) {
			const v = bounce(ball_box, velocity, brick.rect(), epsilon);
			if (!is_nil(v)) {
				return [v, brick];
			}
		}
	}

	function ball_collides_with_vaus(ball_box, velocity) {
		const epsilon = 1/screen.absoluteScale();
		const vaus_box = vaus.rect();
		if (overlap(ball_box, vaus_box, epsilon) !== overlap.NONE) {
			const ball_x = ball_box.center.x;
			const vaus_x = vaus_box.center.x;
			ballXOffset = ball_x - vaus_x;
			if (vaus.mode() === Vaus.Mode.Catch) {
				return [Vector.Null, vaus];
			} else {
				const teta = ball_bounce_angle(ballXOffset, vaus_box.width);
				return [
					Vector({x: Math.sin(teta), y: -Math.cos(teta)}).mul(slow_down(velocity.norm, BALL_SPEED_INITIAL)),
					vaus
				];
			}
		}
	}

	function ball_collides_with_walls(ball_box, velocity) {
		if (ball_box.leftX <= gameZone.leftX) {
			// collide with left wall
			return [Vector({x: -velocity.x, y: velocity.y})];
		} else if (ball_box.rightX >= gameZone.rightX) {
			// collide with right wall
			return [Vector({x: -velocity.x, y: velocity.y})];
		} else if (ball_box.topY <= gameZone.topY) {
			// collide with roof
			const speed = velocity.norm;
			const v = speed_up(speed, BALL_SPEED_MAX)/speed;
			return [Vector({x: v*velocity.x, y: -v*velocity.y})];
		}
	}

	function ball_goes_out(ball_box, velocity) {
		if (ball_box.bottomY >= gameZone.bottomY) {
			if(model.cheatMode()) {
				return [Vector({x: velocity.x, y: -velocity.y})];
			}
			return [];
		}
	}

	const ball_collides = dispatch(
		ball_collides_with_bricks,
		ball_collides_with_vaus,
		ball_collides_with_walls,
		ball_goes_out,
		(ball_box, velocity) => [velocity]
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

	function bullet_collides(bullet) {
		const epsilon = 1/screen.absoluteScale();
		const bullet_box = bullet.rect();
		if (bullet_box.bottomY > 0) {
			for (let brick of bricks.neighborhood(bullet_box.topLeft)) {
				if (overlap(bullet_box, brick.rect(), epsilon) !== overlap.NONE) {
					brick.hit();
					bullet.destroy();
				}
			}
		} else bullet.destroy();
	}

	//////////////////////////////////////////////////////////////////////////
	// Position helpers

	function reset_ball_position(ball) {
		const vaus_box = vaus.rect();
		ball.setPosition({
			x: vaus_box.center.x + ballXOffset,
			y: vaus_box.topLeft.y - ball.rect().width
		});
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

	function update_bullet(bullet) {
		bullet_collides(bullet);
		bullet.update();
	}

	function update_pill(pill) {
		pill_collides(pill);
		pill.update();
	}

	function update_vaus() {
		const {leftX: vaus_left_x, rightX: vaus_right_x} = vaus.rect();
		const {leftX: zone_left_x, rightX: zone_right_x} = gameScene.localRect();
		if (!vaus.velocity().isNull() && vaus_left_x <= zone_left_x) {
			vaus.setPosition(vaus.position().add({x: zone_left_x - vaus_left_x, y: 0}));
			vaus.move(Vector.Null);
		}
		if (!vaus.velocity().isNull() && vaus_right_x >= zone_right_x) {
			vaus.setPosition(vaus.position().add({x: zone_right_x - vaus_right_x, y: 0}));
			vaus.move(Vector.Null);
		}
		vaus.update();
	}

	function update() {
		if (model.isRunning()) {
			update_vaus();
			for (let bullet of bullets) {
				update_bullet(bullet);
			}
			for (let ball of balls) {
				update_ball(ball);
			}
			for (let pill of pills) {
				update_pill(pill);
			}
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
	bullets
		.on('itemAdded', bullet => gameScene.add(bullet))
		.on('itemDestroyed', bullet => gameScene.remove(bullet));
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
		.on('powerUp', flow(
			power_up => {
				model.updateScore(PILL_BONUS_POINT);
				vaus.setMode(Vaus.Mode.Small);
				throw_ball();
				balls.unsplit().setSpeed(BALL_SPEED_INITIAL);
				return power_up;
			},
			cond([
				[matcher(Pill.ExtraLife), () => model.gainLife()],
				[matcher(Pill.Catch),     () => vaus.setMode(Vaus.Mode.Catch)],
				[matcher(Pill.Expand),    () => vaus.setMode(Vaus.Mode.Large)],
				[matcher(Pill.Laser),     () => vaus.setMode(Vaus.Mode.Armed)],
				[matcher(Pill.Split),     () => balls.split()],
				[matcher(Pill.Slow),      () => balls.setSpeed(BALL_SPEED_MIN)]
			])
		))
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
				ballXOffset = .5;
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
				bullets.reset();
				pills.reset();
			}],
			[matcher('state', GameModel.State.Running), () => {
				balls.show();
				vaus.show();
				ballTimeout = setTimeout(throw_ball, BALL_TIMEOUT);
				keyboard.use(KeyboardController());
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
			if (vaus.mode() === Vaus.Mode.Armed) {
				const vaus_box = vaus.rect();
				bullets.create(vaus_box.topLeft.add({x: 1, y: 0}));
				bullets.create(vaus_box.topRight.sub({x: 1 + 8/16, y: 0}));
			}
			throw_ball();
		});

	vaus.hide();
	balls.hide();
	scene.add(
		CreateWalls(scene.width() - 1, scene.height()),
		gameScene.add(
			brickScene,
			vaus
		)
	);

	return {
		run() {
			loop();
			return this;
		}
	};
}
