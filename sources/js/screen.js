import is_nil from 'lodash/isNil';
import is_number from 'lodash/isNumber';
import is_string from 'lodash/isString';

export default function createScreen(canvas_context) {
	let snap_enabled = true;
	let snap_by = .5;
	let snap_stack = [];

	function snap(x) {
		const w = canvas_context.lineWidth;
		if (snap_enabled) {
			return Math.round(w) === w && (w % 2) === 0 ? x : Math.round(x) + snap_by;
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
		get snap() {
			return snap_by;
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
			const {width, height} = canvas_context.canvas;
			this.fillRect({x: 0, y: 0, width, height});
		},
		drawRect({x, y, width, height}) {
			canvas_context.strokeRect(snap(x), snap(y), width, height);
		},
		fillRect({x, y, width, height}) {
			canvas_context.fillRect(x, y, width, height);
		},
		drawLine({x: x1, y: y1}, {x: x2, y: y2}) {
			this.save();
			this.moveTo({x: x1, y: y1});
			this.lineTo({x: x2, y: y2});
			this.restore();
		},
		moveTo({x, y}) {
			canvas_context.moveTo(snap(x), snap(y));
		},
		lineTo({x, y}) {
			canvas_context.lineTo(snap(x), snap(y));
		},
		scale(f) {
			snap_by *= f; 
			canvas_context.scale(f, f);
		},
		translate({x, y}) {
			canvas_context.translate(x, y);
		},
		rotate(angle) {
			canvas_context.rotate(angle);
		},
		save() {
			canvas_context.save();
			snap_stack.push(snap_by);
		},
		restore() {
			canvas_context.restore();
			snap_by = snap_stack.pop();
		}
	};
}
