import Vector from 'vector';
import Rect from 'rect';

const radius = .35;

function Ball({x, y}, scale) {

	let pos = Vector({x, y});
	return {
		get pos() {
			return pos;
		},
		set pos({x, y}) {
			pos = Vector({x, y});
		},
		get bbox() {
			return Rect(pos.add({x: -radius, y: -radius}), {width: radius*2, height: radius*2});
		},
		set bbox({x, y}) {
			pos = Vector({x, y}).add({x: radius, y: radius});
		},
		get radius() {
			return radius;
		},
		move(v){
			let {x, y} = pos.add(v).mul(scale);
			pos = Vector({x: (x | 0) + .5, y}).mul(1/scale);
		},
		draw(screen) {
			screen.brush = 'white';
			screen.pen = {
				strokeStyle: 'red',
				lineWidth: 2/scale
			};
			screen.beginPath();
			screen.arc({x: 0, y: 0}, radius, 0, 2*Math.PI, false);
			screen.closePath();
			screen.fillPath();
			screen.drawPath();
		}
	};
}

Ball.Radius = radius;

export default Ball;
