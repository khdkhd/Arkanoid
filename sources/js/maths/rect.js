import createVector from 'maths/vector';

export default function createRect({x, y}, {width, height}) {
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
			return {
				width,
				height
			};
		},
		get leftX() {
			return x;
		},
		get rightX() {
			return x + width;
		},
		get topY() {
			return y;
		},
		get bottomY() {
			return y + height;
		},
		get topLeft() {
			return createVector({
				x: x,
				y: y
			});
		},
		get topRight() {
			return createVector({
				x: x + width,
				y: y
			});
		},
		get bottomLeft() {
			return createVector({
				x: x,
				y: y + height
			});
		},
		get bottomRight() {
			return createVector({
				x: x + width,
				y: y + height
			});
		},
		get center() {
			return createVector({
				x: x + width/2,
				y: y + height/2
			});
		},
		contains({x, y}) {
			return x >= this.bottomLeft.x  && y <= this.bottomLeft.y
				&& x >= this.topLeft.x     && y >= this.topLeft.y
				&& x <= this.topRight.x    && y >= this.topRight.y
				&& x <= this.bottomRight.x && y <= this.bottomRight.y;
		},
		intersect(rect) {
			return this.contains(rect.topRight)
				|| this.contains(rect.bottomRight)
				|| this.contains(rect.bottomLeft)
				|| this.contains(rect.topLeft);
		},
		translate({x, y}) {
			return createRect(this.topLeft.add({x, y}), {width, height});
		},
		scale({x, y}){
			return createRect(this.topLeft, {width: width*x, height: height*y});
		}
	};
}
