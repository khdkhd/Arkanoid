import {completeAssign} from 'common/utils';
import {dispatch} from 'common/functional';
import {bounce} from 'physics/collisions';

import Ball from 'game/ball';
import Vaus from 'game/vaus';
import createBricks from 'game/brick';
import gameKeyboardController from 'game/keyboard-controller';

import Vector from 'maths/vector';


import matches from 'lodash.matches';
import ui from 'ui';

import random from 'lodash.random';
import remove from 'lodash.remove';
import is_nil from 'lodash.isnil';
import cond from 'lodash.cond';

import {EventEmitter} from 'events';

import soundController  from 'sound/arkanoid/sound-controller';

const keyboard = ui.keyboard;

export default function GameController(state) {
	const emitter = new EventEmitter();
	const zone = state.zone;
	const ball = Ball(Vector.Null);
	const vaus = Vaus({x: 1, y: zone.height - 2});

	let bricks = [];
	let paused = false;

	// Position helpers

	function ball_neighborhood() {
		const pos = ball.position();
		const col = Math.round(pos.x);
		const row = Math.round(pos.y);
		return bricks.filter(brick => {
			const brick_pos = brick.position();
			return Math.abs(col - brick_pos.x) <= 2 && Math.abs(row - brick_pos.y) <= 1;
		});
	}

	function reset_ball_position() {
		const vaus_box = vaus.rect();
		ball.reset(vaus_box.center.sub({
			x: ball.size().width/2,
			y: ball.size().height + vaus_box.height/2
		}));
	}

	function reset_vaus_position() {
		vaus.reset({x: 1, y: zone.height - 2});
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
		if (ball_box.leftX <= zone.leftX) {
			ball.emit('hit', 'wall');
			// collide with left wall
			return Vector({x: -speed.x, y: speed.y});
		} else if (ball_box.rightX >= zone.rightX) {
			ball.emit('hit', 'wall');
			// collide with right wall
			return Vector({x: -speed.x, y: speed.y});
		} else if (ball_box.topY <= zone.topY) {
			// collide with roof
			ball.emit('hit', 'wall');
			return Vector({x: speed.x, y: -speed.y});
		}
	}

	function ball_goes_out(ball_box, speed) {
		if (ball_box.bottomY >= zone.bottomY) {
			if(state.cheatMode) {
				ball.emit('hit', 'wall');
				return Vector({x: speed.x, y: -speed.y});
			}
			emitter.emit(vaus.lifes() > 0 ? 'ball-out' : 'game-over');
			return Vector.Null;
		}
	}

	const ball_collides = dispatch(
		ball_collides_with_bricks,
		ball_collides_with_vaus,
		ball_collides_with_walls,
		ball_goes_out
	);


	// Move helpers

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
		const {leftX: vaux_left_x, rightX: vaus_right_x} = vaus.rect();
		const {leftX: zone_left_x, rightX: zone_right_x} = zone;

		if (!vaus.velocity().isNull() && vaux_left_x <= zone_left_x) {
			vaus.move(Vector.Null);
			vaus.setPosition(vaus.position().add({x: zone_left_x - vaux_left_x, y: 0}));
		}

		if (!vaus.velocity().isNull() && vaus_right_x >= zone_right_x) {
			vaus.move(Vector.Null);
			vaus.setPosition(vaus.position().add({x: zone_right_x - vaus_right_x, y: 0}));
		}

		vaus.update();
	}

	// Game helpers

	function bricks_remaining() {
		return bricks.reduce(
			(count, brick) => brick.color === 'gold' ? count : count + 1,
			0
		);
	}

	// Events

	keyboard
		.on('direction-changed', direction => vaus.move(direction))
		.on('pause', () => emitter.emit('pause'))
		.on('fire', () => {
			if (ball.velocity().isNull()) {
				ball.setVelocity(Vector({x: 1, y: -1}).toUnit().mul(.2));
			}
		});

	ball
		.on('out', () => {
			if (vaus.lifes() > 0) {
				vaus.useLife();
			}
			emitter.emit('lifes', vaus.lifes());
		})
		.on('hit', cond([
			[matches('brick'), soundController.ballCollidesWithBricks],
			[matches('vaus'), soundController.ballCollidesWithVaus]
		]));
	emitter.on('ball-out', soundController.ballGoesOut);

	state.scene.add(vaus, ball);

	ui.lifes.setModel(vaus).render();

	return completeAssign(emitter, {
		update() {
			if (!paused) {
				update_ball();
				update_vaus();
			}
			return this;
		},
		init(level) {
			bricks.forEach(brick => {
				state.scene.remove(brick);
				brick
					.removeAllListeners('destroyed')
					.removeAllListeners('hit')
					.hide();
			});
			bricks = createBricks(level);
			bricks.forEach(brick => {
				state.scene.add(brick);
				brick
					.on('hit', point => emitter.emit('update-score', point))
					.once('destroyed', () => {
						brick
							.removeAllListeners('destroyed')
							.removeAllListeners('hit')
							.hide();
						remove(bricks, brick);
						const remain = bricks_remaining();
						if (remain === 0) {
							emitter.emit('end-of-level');
						}
					});
			});
			return this;
		},
		pause() {
			if (paused) {
				ball.show();
				vaus.show();
			} else {
				ball.hide();
				vaus.hide();
			}
			paused = !paused;
			return this;
		},
		start() {
			reset_vaus_position();
			reset_ball_position();
			ball.show();
			vaus
				.useLife()
				.show();
			keyboard.use(gameKeyboardController);
			paused = false;
			return this;
		},
		stop() {
			ball.hide();
			vaus.hide();
			keyboard.use(null);
			paused = true;
			return this;
		}
	});
}
