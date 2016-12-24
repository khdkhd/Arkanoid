import Vector from 'maths/vector';

export default function VerletModel({x: px0, y: py0}, {x: vx0, y: vy0} = {x: 0, y: 0}) {
	let current = Vector({x: px0, y: py0});
	let previous = current.sub(Vector({x: vx0, y: vy0}));

	const velocity = () => current.sub(previous);
	return {
		get position() {
			return current;
		},
		set position({x, y}) {
			const v = velocity();
			current = Vector({x, y});
			previous = current.sub(v);
		},
		get velocity() {
			return velocity();
		},
		set velocity({x, y}) {
			previous = current.sub({x, y});
		}
	};
}
