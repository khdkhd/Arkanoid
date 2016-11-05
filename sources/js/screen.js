import is_nil from 'lodash/isNil';
import is_number from 'lodash/isNumber';
import is_string from 'lodash/isString';

import Rect from 'rect';

export default function createScreen(canvas_context) {
	let snap_enabled = true;
	let scale_factor = {x: 1, y: 1};
	let scale_factor_stack = [];

	function scale_is_uniform() {
		return scale_factor.x === scale_factor.y;
	}

	function should_snap(w) {
		return !(Math.round(w) === w && (w % 2) === 0);
	}

	function snap(x) {
		if (snap_enabled && scale_is_uniform()) {
			const w = canvas_context.lineWidth*scale_factor.x;
			if (should_snap(w)) {
				return (Math.round(x*scale_factor.x) + .5)/scale_factor.x;
			}
		}
		return x;
	}

	return {
		toggleSnap(enabled) {
			if (is_nil(enabled)) {
				snap_enabled = !snap_enabled;
			} else {
				snap_enabled = enabled;
			}
		},
		get width() {
			return canvas_context.canvas.width;
		},
		set width(w) {
			canvas_context.canvas.width = w;
		},
		get height() {
			return canvas_context.canvas.height;
		},
		set height(h) {
			canvas_context.canvas.height = h;
		},
		get size() {
			return {
				width: canvas_context.canvas.width,
				height: canvas_context.canvas.height
			};
		},
		set size({width, height}) {
			this.width = width;
			this.height = height;
		},
		get rect() {
			return Rect({x: 0, y: 0}, this.size);
		},
		get pen() {
			return {
				lineWidth: canvas_context.lineWidth,
				strokeStyle: canvas_context.strokeStyle
			};
		},
		set pen(pen) {
			if (is_number(pen)) {
				canvas_context.lineWidth = pen;
			} else if (is_string(pen)) {
				canvas_context.strokeStyle = pen;
			} else {
				canvas_context.lineWidth = pen.lineWidth;
				canvas_context.strokeStyle = pen.strokeStyle;
			}
		},
		get brush() {
			return {
				fillStyle: canvas_context.fillStyle,
				get isGradient() {
					return false;
				},
				get isSolid() {
					return false;
				}
			};
		},
		set brush(brush) {
			if (is_string(brush)) {
				canvas_context.fillStyle = brush;
			} else {
				canvas_context.fillStyle = brush.fillStyle;
			}
		},
		clear() {
			canvas_context.fillRect(0, 0, this.width, this.height);
		},
		drawRect({x, y, width, height}) {
			const r = Rect({x, y}, {width, height});
			this.save();
			this.beginPath();
			this.moveTo(r.topLeft);
			this.lineTo(r.topRight);
			this.lineTo(r.bottomRight);
			this.lineTo(r.bottomLeft);
			this.closePath();
			this.drawPath();
		},
		lineTo({x, y}) {
			canvas_context.lineTo(snap(x), snap(y));
		},
		scale(f) {
			scale_factor = is_number(f) ? {x: f, y: f} : f;
			canvas_context.scale(scale_factor.x, scale_factor.y);
		},
		fillRect({ x, y, width, height}) {
			const r = Rect({x, y}, {width, height});
			// this.save();
			this.beginPath();
			this.moveTo(r.topLeft);
			this.lineTo(r.topRight);
			this.lineTo(r.bottomRight);
			this.lineTo(r.bottomLeft);
			this.closePath();
			this.fillPath();
			// this.restore();
		},
		drawLine({x: x1, y: y1}, {x: x2, y: y2}) {
			this.save();
			this.moveTo({
				x: x1,
				y: y1
			});
			this.lineTo({
				x: x2,
				y: y2
			});
			this.restore();
		},
		drawPath(path) {
			if (is_nil(path)) {
				canvas_context.stroke();
			} else {
				canvas_context.stroke(path);
			}
		},
		beginPath() {
			canvas_context.beginPath();
		},
		closePath() {
			canvas_context.closePath();
		},
		fillPath(path) {
			canvas_context.fill(path);
		},
		moveTo({x, y}) {
			canvas_context.moveTo(snap(x), snap(y));
		},
		translate({x, y}) {
			console.log(x,y);
			canvas_context.translate(x, y);
		},
		rotate(angle) {
			canvas_context.rotate(angle);
		},
		save() {
			canvas_context.save();
			scale_factor_stack.push(scale_factor);
		},
		restore() {
			canvas_context.restore();
			scale_factor = scale_factor_stack.pop();
		},
		createLinearGradient(x1, y1, x2, y2, colorStops) {
					const grd = canvas_context.createLinearGradient(x1,y1,x2,y2);
					for(let stop of colorStops){
						grd.addColorStop(stop.pos, stop.color);
					}
					return grd;
		}
	};
}
