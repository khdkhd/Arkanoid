import Vector from 'maths/vector';
import is_number from 'lodash.isnumber';
import is_nil from 'lodash.isnil';

export default function Rect({x, y}, {width, height}) {
	const bottomLeft  = Vector({x,  y: y + height});
	const bottomRight = Vector({x: x + width, y: y + height});
	const center      = Vector({x: x + width/2, y: y + height/2});
	const topLeft     = Vector({x,  y});
	const topRight    = Vector({x: x + width, y: y});
	return {
		get x() {
			return x;
		},
		set x(x_) {
			x = x_;
			bottomLeft.x = topLeft.x = x_;
			bottomRight.x = topRight.x = x_ + width;
			center.x = x_ + width/2;
		},
		get y() {
			return y;
		},
		set y(y_) {
			y = y_;
			topLeft.y = topRight.y = y_;
			bottomLeft.y = bottomRight.y = y_ + height;
			center.y = y_ + height/2;
		},
		get width() {
			return width;
		},
		set width(w) {
			width = w;
			topRight.x = bottomRight.x = x + width;
			center.x = x + width/2;
		},
		get height() {
			return height;
		},
		set height(h) {
			height = h;
			bottomLeft.y = bottomRight.y = y + height;
			center.y = y + height/2;
		},
		get size() {
			return { width, height };
		},
		get leftX() {
			return x;
		},
		get rightX() {
			return topRight.x;
		},
		get topY() {
			return y;
		},
		get bottomY() {
			return bottomLeft.y;
		},
		get topLeft() {
			return topLeft;
		},
		get topRight() {
			return topRight;
		},
		get bottomLeft() {
			return bottomLeft;
		},
		get bottomRight() {
			return bottomRight;
		},
		get center() {
			return center;
		},
		get area() {
			return width*height;
		},
		contains({x, y}) {
			return x >= bottomLeft.x  && y <= bottomLeft.y
				&& x >= topLeft.x     && y >= topLeft.y
				&& x <= topRight.x    && y >= topRight.y
				&& x <= bottomRight.x && y <= bottomRight.y;
		},
		overlap(rect) {
			return this.contains(rect.topRight)
				|| this.contains(rect.bottomRight)
				|| this.contains(rect.bottomLeft)
				|| this.contains(rect.topLeft);
		},
		translate({x, y}) {
			return Rect(topLeft.add({x, y}), {width, height});
		},
		scale(f) {
			const {x, y} = is_number(f) ? {x: f, y: f} : f;
			return Rect(topLeft, {width: width*x, height: height*y});
		},
		intersect(rect) {
			if (this.overlap(rect)) {
				const top_l_x = Math.max(topLeft.x, rect.topLeft.x);
				const top_l_y = Math.max(topLeft.y, rect.topLeft.y);
				const btm_r_x = Math.min(bottomRight.x, rect.bottomRight.x);
				const btm_r_y = Math.min(bottomRight.y, rect.bottomRight.y);
				return Rect({x: top_l_x, y: top_l_y}, {
					width: Math.abs(btm_r_x - top_l_x),
					height: Math.abs(btm_r_y - top_l_y)
				});
			}
			return null;
		},
		unit(rect) {
			const top_l_x = Math.min(topLeft.x, rect.topLeft.x);
			const top_l_y = Math.min(topLeft.y, rect.topLeft.y);
			const btm_r_x = Math.max(bottomRight.x, rect.bottomRight.x);
			const btm_r_y = Math.max(bottomRight.y, rect.bottomRight.y);
			return Rect({x: top_l_x, y: top_l_y}, {
				width: Math.abs(btm_r_x - top_l_x),
				height: Math.abs(btm_r_y - top_l_y)
			});
		}
	};
}

Rect.unit = function(rects) {
	return rects.reduce((acc, rect) => is_nil(acc) ? rect : acc.unit(rect), null);
};

Rect.intersect = function(rects) {
	return rects.reduce((acc, rect) => is_nil(acc) ? rect : acc.intersect(rect), null);
};
