import constant from 'lodash.constant';

import Rect from 'maths/rect';
import Vector from 'maths/vector';

export default function VerletModel(size, {x: px0, y: py0} = {x: 0, y: 0}, {x: vx0, y: vy0} = {x: 0, y: 0}) {
	const current = Vector({x: px0, y: py0});
	const velocity = Vector({x: vx0, y: vy0});
	const previous = current.sub(velocity);
	const rect = Rect(current, size);

	return {
		position() {
			return current;
		},
		setPosition({x, y}) {
			current.x = rect.x = x;
			current.y = rect.y = y;
			previous.x = current.x - velocity.x;
			previous.y = current.y - velocity.y;
			return this;
		},
		velocity() {
			return velocity;
		},
		setVelocity({x, y}) {
			velocity.x = x;
			velocity.y = y;
			previous.x = current.x - x;
			previous.y = current.y - y;
			return this;
		},
		update() {
			this.setPosition({
				x: current.x + velocity.x,
				y: current.y + velocity.y
			});
		},
		localRect: constant(Rect(Vector.Null, size)),
		rect() {
			return rect;
		},
		size() {
			return rect.size;
		},
		setSize({width, height}) {
			rect.width = width;
			rect.height = height;
		}
	};
}
