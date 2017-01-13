import {completeAssign} from 'common/utils';
import {dispatch} from 'common/functional';
import {bounce} from 'physics/collisions';
import create_collision_buzzer from 'sound/arkanoid/collision-buzzer';

import ui from 'ui';

import Vector from 'maths/vector';

import random from 'lodash.random';
import remove from 'lodash.remove';
import is_nil from 'lodash.isnil';
import matches from 'lodash.matches';
import constant from 'lodash.constant';
import cond from 'lodash.cond';

import {EventEmitter} from 'events';

const AudioContext = AudioContext || webkitAudioContext;

const keyboard = ui.keyboard;
const audio_context = new AudioContext();
const collisionBuzzer = create_collision_buzzer(audio_context);

export default function GameController(state) {
	const {ball, vaus} = state;
	const zone = state.scene.boundingBox.relative;
	const scale = state.scene.scale;
	const emitter = new EventEmitter();

	// Position helpers

	function ball_neighborhood() {
		const col = Math.round(ball.position.x);
		const row = Math.round(ball.position.y);
		return state.bricks
			.filter(brick => Math.abs(col - brick.position.x) <= 2
								&& Math.abs(row - brick.position.y) <= 1);
	}

	function reset_ball_position() {
		const vaus_box = vaus.boundingBox.absolute;
		ball.reset({x: vaus_box.center.x, y: vaus_box.topY - ball.radius});
	}

	// Collision helpers

	function ball_collides_with_bricks(ball_box, speed) {
		for (let brick of ball_neighborhood(ball)) {
			const brick_box = brick.boundingBox.absolute;
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

	const buzz = cond([
		[matches('brick'), constant({note: 'A', octave: '2', duration: .125})],
		[matches('vaus'), constant({note: 'F', octave: '3', duration: .125})],
		[constant(true), constant(null)]
	]);

	ball.on('hit', target => {
		collisionBuzzer.buzz(buzz(target));
	});



	function ball_collides_with_vaus(ball_box, speed) {
		const v = bounce(ball_box, speed, vaus.boundingBox.absolute, 1/scale);
		if (!is_nil(v)) {
			ball.emit('hit', 'vaus');
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

	function update_ball() {
		if (!ball.velocity.isNull()) {
			const ball_box = ball.boundingBox.absolute.translate(ball.velocity);
			if (ball_box.bottomY >= zone.bottomY) {
				reset_ball_position(vaus, ball);
			} else {
				ball.velocity = ball_collides(ball_box, ball.velocity);
			}
		} else {
			reset_ball_position(vaus, ball);
		}
		ball.update();
	}

	function update_vaus() {
		const {leftX: vaux_left_x, rightX: vaus_right_x} = vaus.boundingBox.absolute;
		const {leftX: zone_left_x, rightX: zone_right_x} = zone;

		if (!vaus.velocity.isNull() && vaux_left_x <= zone_left_x) {
			vaus.move(Vector.Null);
			vaus.position = vaus.position.add({x: zone_left_x - vaux_left_x, y: 0});
		}

		if (!vaus.velocity.isNull() && vaus_right_x >= zone_right_x) {
			vaus.move(Vector.Null);
			vaus.position = vaus.position.add({x: zone_right_x - vaus_right_x, y: 0});
		}

		vaus.update();
	}

	// Game helpers

	function bricks_remaining() {
		return state.bricks.reduce(
			(count, brick) => brick.color === 'gold' ? count : count + 1, 0
		);
	}

	keyboard.on('direction-changed', direction => {
		vaus.move(direction);
	});
	keyboard.on('fire', () => {
		if (ball.velocity.isNull()) {
			ball.velocity = Vector({x: 1, y: -1}).toUnit().mul(.2);
		}
	});
	keyboard.on('pause', () => emitter.emit('pause'));

	return completeAssign(emitter, {
		update() {
			update_ball();
			update_vaus();
		},
		reset() {
			reset_ball_position();
			state.bricks.forEach(brick => {
				brick.on('hit', point => {
					emitter.emit('update-score', point)
				});
				brick.once('destroyed', () => {
					brick.removeAllListeners('destroyed');
					brick.removeAllListeners('hit');
					brick.toggleRender(false);
					remove(state.bricks, brick);
					const remain = bricks_remaining();
					if (remain === 0) {
						emitter.emit('end-of-level');
					}
				});
			});
		}
	})
}
