import {completeAssign} from 'common/utils';
import {
	armed as armedVausPath,
	large as largeVausPath,
	small as smallVausPath,
	tiny  as tinyVausPath,
} from 'game/entities/vaus/path';
import SceneObject from 'graphics/scene-object';
import Vector from 'maths/vector';
import VerletModel from 'physics/verlet-model';

import {EventEmitter} from 'events';

export function VausModel({x, y}) {
	return {
		emitter: new EventEmitter(),
		mode: Vaus.Mode.Small,
		coordinates: VerletModel({
			width: 4.125,
			height: 1.125
		}, {x, y})
	};
}

export function VausView(state) {
	const paths = {
		[Vaus.Mode.Armed]: armedVausPath,
		[Vaus.Mode.Large]: largeVausPath,
		[Vaus.Mode.Small]: smallVausPath,
		[Vaus.Mode.Tiny]:  tinyVausPath
	};
	return SceneObject(state.coordinates, {
		onRender(screen) {
			for (let [path, color] of paths[state.mode]) {
				screen.brush = color;
				screen.fillPath(path);
			}
		}
	});
}

export function VausController(state) {
	const {coordinates} = state;
	let acceleration = Vector.Null;
	let moving = false;
	return {
		hit() {
			state.emitter.emit('hit');
		},
		move(direction) {
			const thrust = 1/16;
			moving = !direction.isNull();
			if (moving) {
				acceleration = direction.mul(thrust);
			} else if (coordinates.velocity().scalar(acceleration) > 0) {
				acceleration = acceleration.opposite;
			}
			return this;
		},
		update() {
			const velocity = coordinates.velocity().add(acceleration);
			const scalar = velocity.scalar(acceleration);
			const speed = Math.abs(velocity.x); // equivalent to velocity.norm
			const thrust = 1/16;
			const max_speed = 8/16;

			if (!moving && speed <= thrust) {
				coordinates.setVelocity(Vector.Null);
			} else if (moving && scalar >= 0 && Math.abs(speed - max_speed) <= thrust) {
				coordinates.setVelocity(Vector({x: Math.sign(acceleration.x)*max_speed, y: 0}));
			} else {
				coordinates.setVelocity(velocity);
			}
			coordinates.update();
			return this;
		},
		setMode(mode) {
			state.mode = mode;
			if (mode === Vaus.Mode.Armed) {
				state.coordinates.setSize({
					width: 4.125,
					height: 1.125
				});
			} else if (mode == Vaus.Mode.Large) {
				state.coordinates.setSize({
					width: 6.125,
					height: 1.125
				});
			} else if (mode === Vaus.Mode.Small) {
				state.coordinates.setSize({
					width: 4.125,
					height: 1.125
				});
			} else if (mode === Vaus.Mode.Tiny) {
				state.coordinates.setSize({
					width: 2,
					height: 0.75
				});
			}
			return this;
		},
		mode() {
			return state.mode;
		},
		reset({x, y}) {
			coordinates
				.setVelocity(Vector.Null)
				.setPosition(Vector({x, y}));
			return this;
		},
	};
}

export function Vaus({x, y}) {
	const state = VausModel({x, y});
	return completeAssign(
		state.emitter,
		state.coordinates,
		VausView(state),
		VausController(state)
	);
}

Object.defineProperty(Vaus, 'Mode', {
	writable: false,
	value: Object.freeze({
		Armed: Symbol('Vaus.Armed'),
		Large: Symbol('Vaus.Large'),
		Small: Symbol('Vaus.Small'),
		Tiny:  Symbol('Vaus.Tiny')
	})
});

export default Vaus;
