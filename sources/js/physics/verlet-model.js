import Vector from 'maths/vector';

export default function VerletModel({x: px0, y: py0}, {x: vx0, y: vy0} = {x: 0, y: 0}) {
	let current = Vector({x: px0, y: py0});
	let previous = current.sub(Vector({x: vx0, y: vy0}));

	const velocity = () => current.sub(previous);
	return {
		position() {
			return current;
		},
		setPosition({x, y}) {
			const v = velocity();
			current = Vector({x, y});
			previous = current.sub(v);
			return this;
		},
		velocity() {
			return velocity();
		},
		setVelocity({x, y}) {
			previous = current.sub({x, y});
			return this;
		}
	};
}
