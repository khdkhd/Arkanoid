import Vector from 'maths/vector';

const NONE = 0;

const LEFT = 1;
const TOP = 2;
const RIGHT = 3;
const BOTTOM = 4;

const TOP_LEFT = 5;
const TOP_RIGHT = 6;

const BOTTOM_RIGHT = 7;
const BOTTOM_LEFT = 8;

function almost_equal(a, b, epsilon) {
	return Math.abs(a - b) < epsilon;
}

export function overlap(a_box, b_box, epsilon = 1) {
	const w = (a_box.width + b_box.width)/2;
	const h = (a_box.height + b_box.height)/2;
	const {x: dx, y: dy} = a_box.center.sub(b_box.center);

	let x_overlap = Math.abs(dx) - w;
	let y_overlap = Math.abs(dy) - h;

	if (almost_equal(x_overlap, 0, epsilon)) {
		x_overlap = 0
	}

	if (almost_equal(y_overlap, 0, epsilon)) {
		y_overlap = 0;
	}

	if (x_overlap <= 0 && y_overlap <= 0) {
		// boxes collide
		x_overlap = Math.abs(x_overlap);
		y_overlap = Math.abs(y_overlap);

		if (almost_equal(x_overlap, y_overlap, epsilon)) {
			if (dx <= 0 && dy <= 0) {
				return TOP_LEFT;
			}
			if (dx <= 0 && dy >= 0) {
				return BOTTOM_LEFT;
			}
			if (dx >= 0 && dy <= 0) {
				return TOP_RIGHT;
			}
			if (dx >= 0 && dy >= 0) {
				return BOTTOM_RIGHT;
			}
		} else if (x_overlap < y_overlap) {
			return dx <= 0 ? LEFT : RIGHT;
		} else {
			return dy <= 0 ? TOP : BOTTOM;
		}
	}

	return NONE;
}
overlap.NONE         = NONE;
overlap.TOP          = TOP;
overlap.RIGHT        = RIGHT;
overlap.BOTTOM       = BOTTOM;
overlap.LEFT         = LEFT;
overlap.TOP_RIGHT    = TOP_RIGHT;
overlap.TOP_LEFT     = TOP_RIGHT;
overlap.BOTTOM_RIGHT = BOTTOM_RIGHT;
overlap.BOTTOM_LEFT  = BOTTOM_RIGHT;

export function bounce(a_box, {x, y}, b_box, epsilon = 1) {
	const side = overlap(a_box, b_box, epsilon);
	if (side !== NONE) {
		// debugger;
		switch (side) {
		case TOP_LEFT:
			if (x < 0 && y > 0) {
				return Vector({x, y: -y});
			} else if (x > 0 && y < 0) {
				return Vector({x: -x, y});
			}
			return Vector({x: -x, y: -y});

		case TOP_RIGHT:
			if (x > 0 && y > 0) {
				return Vector({x, y: -y});
			} else if (x < 0 && y < 0) {
				return Vector({x: -x, y});
			}
			return Vector({x: -x, y: -y});

		case BOTTOM_LEFT:
			if (x < 0 && y < 0) {
				return Vector({x, y: -y});
			} else if (x > 0 && y > 0) {
				return Vector({x: -x, y});
			}
			return Vector({x: -x, y: -y});

		case BOTTOM_RIGHT:
			if (x > 0 && y < 0) {
				return Vector({x, y: -y});
			} else if (x < 0 && y > 0) {
				return Vector({x: -x, y});
			}
			return Vector({x: -x, y: -y});

		case LEFT:
			if (x < 0) {
				return Vector({x: x, y: -y});
			}
			return Vector({x: -x, y});

		case RIGHT:
			if (x > 0) {
				return Vector({x, y: -y});
			}
			return Vector({x: -x, y});

		case TOP:
			if (y < 0) {
				return Vector({x: -x, y});
			}
			return Vector({x, y: -y});

		case BOTTOM:
			if (y > 0) {
				return Vector({x: -x, y});
			}
			return Vector({x, y: -y});
		}
	}
}

// export function bounce2(a_box, a_speed, b_box, fx_calback, epsilon) {
// 	const side = overlap(a_box, b_box, epsilon);
// }
