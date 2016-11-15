import Vector from 'vector';
import identity from 'lodash.identity';

export default function Mover(state, acceleration, init_speed, init_time, snap = identity) {
	return {
		get acceleration() {
			return acceleration;
		},
		set acceleration(a) {
			acceleration = a;
		},
		set initSpeed(v) {
			init_speed = v;
		},
		set initTime(t) {
			init_time = t;
		},
		speed(t = init_time) {
			return (acceleration.isNull()
				? init_speed
				: acceleration.mul(t - init_time).add(init_speed));
		},
		move(t) {
			return snap(state.pos.add(this.speed(t)));
		}
	};
}

Mover.Simple = (state, init_speed, snap = identity) => {
	return Mover(state, Vector.Null, init_speed, 0, snap);
}
