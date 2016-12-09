import is_nil from 'lodash/isNil';
import is_number from 'lodash/isNumber';
import is_string from 'lodash/isString';

import Rect from 'maths/rect';

export default function createScreen(canvas_context) {
	let scale_factor = {x: 1, y: 1};
	let scale_factor_stack = [];

	return {
		///////////////////////////////////////////////////////////////////////
		/// Screen metrics
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
		///////////////////////////////////////////////////////////////////////
		/// Pen
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
		///////////////////////////////////////////////////////////////////////
		/// Brush
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
		///////////////////////////////////////////////////////////////////////
		/// Basics drawing routines
		clear() {
			canvas_context.fillRect(0, 0, this.width, this.height);
		},
		drawLine({x: x1, y: y1}, {x: x2, y: y2}) {
			this.beginPath();
			this.moveTo({x: x1, y: y1});
			this.lineTo({x: x2, y: y2});
			this.drawPath();
		},
		drawRect({topLeft, topRight, bottomLeft, bottomRight}) {
			this.beginPath();
			this.moveTo(topLeft);
			this.lineTo(topRight);
			this.lineTo(bottomRight);
			this.lineTo(bottomLeft);
			this.closePath();
			this.drawPath();
		},
		fillRect({topLeft, topRight, bottomLeft, bottomRight}) {
			this.beginPath();
			this.moveTo(topLeft);
			this.lineTo(topRight);
			this.lineTo(bottomRight);
			this.lineTo(bottomLeft);
			this.closePath();
			this.fillPath();
		},
		///////////////////////////////////////////////////////////////////////
		/// Path
		beginPath() {
			canvas_context.beginPath();
		},
		closePath() {
			canvas_context.closePath();
		},
		moveTo({x, y}) {
			canvas_context.moveTo(x, y);
		},
		lineTo({x, y}) {
			canvas_context.lineTo(x, y);
		},
		arc({x, y}, radius, start_angle, end_angle, anticlockwise) {
			canvas_context.arc(x, y, radius, start_angle, end_angle, anticlockwise);
		},
		drawPath(path) {
			if (is_nil(path)) {
				canvas_context.stroke();
			} else {
				canvas_context.stroke(path);
			}
		},
		fillPath(path) {
			if (is_nil(path)) {
				canvas_context.fill();
			} else {
				canvas_context.fill(path);
			}
		},
		///////////////////////////////////////////////////////////////////////
		/// Clip
		clipRect({topLeft, topRight, bottomLeft, bottomRight}) {
			this.beginPath();
			this.moveTo(topLeft);
			this.lineTo(topRight);
			this.lineTo(bottomRight);
			this.lineTo(bottomLeft);
			this.closePath();
			canvas_context.clip();
		},
		///////////////////////////////////////////////////////////////////////
		/// Context save/restore
		save() {
			canvas_context.save();
			scale_factor_stack.push(scale_factor);
		},
		restore() {
			canvas_context.restore();
			scale_factor = scale_factor_stack.pop();
		},
		///////////////////////////////////////////////////////////////////////
		/// Transformations
		scale(f) {
			scale_factor = is_number(f) ? {x: f, y: f} : f;
			canvas_context.scale(scale_factor.x, scale_factor.y);
		},
		translate({x, y}) {
			canvas_context.translate(x, y);
		},
		rotate(angle) {
			canvas_context.rotate(angle);
		},
		///////////////////////////////////////////////////////////////////////
		/// Gradient
		createLinearGradient({x: x1, y: y1}, {x: x2, y: y2}, colorStops) {
			const grd = canvas_context.createLinearGradient(x1, y1, x2, y2);
			for (let stop of colorStops) {
				grd.addColorStop(stop.pos, stop.color);
			}
			return grd;
		}
	};
}
