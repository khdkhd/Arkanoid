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
		size: {
			width: 2*radius,
			height: 2*radius,
		},
		verlet: VerletModel({x, y})
	};
}

export function BallView(state) {
	return SceneObject(completeAssign({
		alignCenterToOrigin: true,
		onRender(scene) {
			const {screen} = scene;
			screen.brush = 'white';
			screen.pen = {
				strokeStyle: 'hsl(210, 50%, 50%)',
				lineWidth: 1/scene.scale
			};
			screen.beginPath();
			screen.arc({x: state.radius, y: state.radius}, state.radius, 0, 2*Math.PI, false);
			screen.closePath();
			screen.fillPath();
			screen.drawPath();
		}
	}, state.verlet, state));
}

export function BallController({verlet}) {
	return completeAssign({
		reset({x, y}) {
			verlet.velocity = Vector.Null;
			verlet.position = Vector({x, y});
		},
		update() {
			verlet.position = verlet.position.add(verlet.velocity);
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
