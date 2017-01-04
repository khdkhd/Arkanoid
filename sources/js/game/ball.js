import {completeAssign} from 'common/utils';
import BoundingBox from 'graphics/bounding-box';
import Vector from 'maths/vector';
import VerletModel from 'physics/verlet-model';
import SceneObject from 'graphics/scene-object';
import {EventEmitter} from 'events';


const radius = .3;

function BallController({verlet}) {
	return {
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
	};
}

function BallView(state) {

	return SceneObject({
		emitter: state.emitter,
		onRender(screen) {
			screen.brush = 'white';
			screen.pen = {
				strokeStyle: 'hsl(210, 50%, 50%)',
				lineWidth: 1/state.scene.scale
			};
			screen.beginPath();
			screen.arc(state.verlet.position, state.radius, 0, 2*Math.PI, false);
			screen.closePath();
			screen.fillPath();
			screen.drawPath();
		}
	});
}

function BallBoundingBox(state) {
	return BoundingBox(completeAssign(
		{},
		{size: state.size},
		state.verlet
	), true);
}

function Ball({x, y}) {
	const verlet = VerletModel(Vector({x, y}));
	const size = {width: 2*radius, height: 2*radius};
	const boundingBox = BallBoundingBox({verlet, size});
	const state = completeAssign(boundingBox, {
		emitter: new EventEmitter(),
		radius,
		size,
		verlet,
	});
	return completeAssign(
		state.emitter,
		verlet,
		boundingBox,
		BallController(state),
		BallView(state)
	);
}

Ball.Radius = radius;

export default Ball;
