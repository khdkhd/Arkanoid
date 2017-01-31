import {completeAssign} from 'common/utils';
import Vector from 'maths/vector';
import VerletModel from 'physics/verlet-model';
import SceneObject from 'graphics/scene-object';
import {EventEmitter} from 'events';

const radius = .3;

export function BallModel({x, y}) {
	return {
		emitter: new EventEmitter(),
		radius,
		verlet: VerletModel({
			width: 2*radius,
			height: 2*radius,
		}, {x, y})
	};
}

export function BallView(state) {
	return SceneObject(state.verlet, {
		onRender(screen) {
			const scale = screen.absoluteScale().x;
			const center = state.verlet.localRect().center;
			screen.brush = 'white';
			screen.pen = {
				strokeStyle: 'hsl(210, 50%, 50%)',
				lineWidth: 1/scale
			};
			screen.beginPath();
			screen.arc(center, state.radius, 0, 2*Math.PI, false);
			screen.closePath();
			screen.fillPath();
			screen.drawPath();
		}
	});
}

export function BallController({verlet}) {
	return completeAssign({
		reset({x, y}) {
			verlet.setVelocity(Vector.Null);
			verlet.setPosition(Vector({x, y}));
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
		state.verlet,
		BallView(state),
		BallController(state)
	);
}

Ball.Radius = radius;

export default Ball;
