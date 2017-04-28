function createVector({x, y}) {
	return {
		get x() {
			return x;
		},
		set x(x_) {
			x = x_;
		},
		get y() {
			return y;
		},
		set y(y_) {
			y = y_;
		},
		get norm() {
			return Math.sqrt(this.x*this.x + this.y*this.y);
		},
		get opposite() {
			return createVector({x: -x, y: -y});
		},
		mutAdd({x, y}) {
			this.x += x;
			this.y += y;
			return this;
		},
		add(v) {
			return createVector({x: this.x, y: this.y}).mutAdd(v);
		},
		mutSub({x, y}) {
			this.x -= x;
			this.y -= y;
			return this;
		},
		sub(v) {
			return createVector({x: this.x, y: this.y}).mutSub(v);
		},
		mutMul(k) {
			this.x *= k;
			this.y *= k;
			return this;
		},
		mul(k) {
			return createVector({x: this.x, y: this.y}).mutMul(k);
		},
		mutTransform({m11, m12, m21, m22}) {
			this.x = this.x*m11 + this.y*m12;
			this.y = this.x*m21 + this.y*m22;
			return this;
		},
		transform(m) {
			return createVector({x: this.x, y: this.y}).mutTransform(m);
		},
		scalar({x, y}) {
			return this.x*x + this.y*y;
		},
		distance({x, y}) {
			return this.sub(createVector({x, y})).norm;
		},
		equal({x, y}) {
			return this.x === x && this.y === y;
		},
		isNull() {
			return this.x === 0 && this.y === 0;
		},
		mutToUnit() {
			return this.mutMul(1/this.norm);
		},
		toUnit() {
			return createVector({x: this.x, y: this.y}).mutToUnit();
		}
	};
}

createVector.Null  = createVector({x:  0, y:  0});
createVector.Up    = createVector({x:  0, y: -1});
createVector.Right = createVector({x:  1, y:  0});
createVector.Down  = createVector({x:  0, y:  1});
createVector.Left  = createVector({x: -1, y:  0});

export default createVector;
