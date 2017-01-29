import constant from 'lodash.constant';

import Rect from 'maths/rect';
import Vector from 'maths/vector';

export default function Coordinates(size, {x = 0, y = 0} = {}) {
	return {
		position: constant(Vector({x, y})),
		localRect: constant(Rect({x: 0, y: 0}, size)),
		rect: constant(Rect({x, y}, size)),
		size: constant(size)
	};
}
