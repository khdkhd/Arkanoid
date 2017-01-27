import {completeAssign} from 'common/utils';
import Vector from 'maths/vector';
import VerletModel from 'physics/verlet-model';
import SceneObject from 'graphics/scene-object';
import {EventEmitter} from 'events';

import constant from 'lodash.constant';

const radius = .3;

export function BallModel({x, y}) {
	return {
		emitter: new EventEmitter(),
		radius,
		size: constant({
			width: 2*radius,
			height: 2*radius,
		}),
		verlet: VerletModel({x, y})
	};
}

export function BallView(state) {
	return SceneObject(null, completeAssign({
		alignCenterToOrigin: true,
		onRender(screen) {
			const scale = Math.max(screen.absoluteScale.x, screen.absoluteScale.y);
			screen.brush = 'white';
			screen.pen = {
				strokeStyle: 'hsl(210, 50%, 50%)',
				lineWidth: 1/scale
			};
			screen.beginPath();
			screen.arc({x: 0, y: 0}, state.radius, 0, 2*Math.PI, false);
			screen.closePath();
			screen.fillPath();
			screen.drawPath();
		}
	}, state.verlet, state));
}

export function BallController({verlet}) {
	return completeAssign({
		reset({x, y}) {
			verlet.setVelocity(Vector.Null);
			verlet.setPosition(Vector({x, y}));
		},
		update() {
			verlet.setPosition(verlet.position().add(verlet.velocity()));
		},
		get radius() {
			return radius;
		}
	}, verlet);
}

export function Ball({x, y}) {
	const state = BallModel({x, y});
	return completeAssign(
		state.emitter,
		BallView(state),
		BallController(state)
	);
}

Ball.Radius = radius;

export default Ball;
