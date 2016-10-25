export default function createVector({x, y}) {
	return {
		get x() {
			return x;
		},
		set x(v) {
			x = v;
		},
		get y() {
			return y;
		},
		set y(v) {
			y = v;
		},
		get norm() {
			return Math.sqrt(this.x*this.x + this.y*this.y);
		},
		add({x, y}) {
			return createVector({x: this.x + x, y: this.y + y});
		},
		sub({x, y}) {
			return createVector({x: this.x - x, y: this.y - y});
		},
		mul(k) {
			return createVector({x: this.x*k, y: this.y*k});
		},
		distance({x, y}) {
			return this.sub(createVector({x, y})).norm();
		},
		equal({x, y}) {
			return this.x === x && this.y === y;
		},
		isNull() {
			return this.x === 0 && this.y === 0;
		}
	};
}
