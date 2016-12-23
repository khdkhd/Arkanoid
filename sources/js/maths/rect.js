import Vector from 'maths/vector';
import is_number from 'lodash/isNumber';

export default function Rect({x, y}, {width, height}) {
	const left_x = x;
	const right_x = x + width;
	const top_y = y;
	const bottom_y = y + height;

	const center = Vector({x: left_x + width/2, y: top_y + height/2});

	const top_left     = Vector({x: left_x,  y: top_y});
	const top_right    = Vector({x: right_x, y: top_y});
	const bottom_left  = Vector({x: left_x,  y: bottom_y});
	const bottom_right = Vector({x: right_x, y: bottom_y});

	return {
		get x() {
			return x;
		},
		get y() {
			return y;
		},
		get width() {
			return width;
		},
		get height() {
			return height;
		},
		get size() {
			return { width, height };
		},
		get leftX() {
			return left_x;
		},
		get rightX() {
			return right_x;
		},
		get topY() {
			return top_y;
		},
		get bottomY() {
			return bottom_y;
		},
		get topLeft() {
			return top_left;
		},
		get topRight() {
			return top_right;
		},
		get bottomLeft() {
			return bottom_left;
		},
		get bottomRight() {
			return bottom_right;
		},
		get center() {
			return center;
		},
		contains({x, y}) {
			return x >= bottom_left.x  && y <= bottom_left.y
				&& x >= top_left.x     && y >= top_left.y
				&& x <= top_right.x    && y >= top_right.y
				&& x <= bottom_right.x && y <= bottom_right.y;
		},
		intersect(rect) {
			return this.contains(rect.topRight)
				|| this.contains(rect.bottomRight)
				|| this.contains(rect.bottomLeft)
				|| this.contains(rect.topLeft);
		},
		translate({x, y}) {
			return Rect(top_left.add({x, y}), {width, height});
		},
		scale(f) {
			const {x, y} = is_number(f) ? {x: f, y: f} : f;
			return Rect(top_left, {width: width*x, height: height*y});
		}
	};
}
