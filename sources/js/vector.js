function createVector({x, y}) {
	return {
		get x() {
			return x;
		},
		get y() {
			return y;
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
		}
	};
}

createVector.Null  = createVector({x:  0, y:  0});
createVector.Up    = createVector({x:  0, y: -1});
createVector.Right = createVector({x:  1, y:  0});
createVector.Down  = createVector({x:  0, y:  1});
createVector.Left  = createVector({x: -1, y:  0});

export default createVector;
