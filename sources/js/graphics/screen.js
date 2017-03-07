import is_nil from 'lodash.isnil';
import is_number from 'lodash.isnumber';
import is_string from 'lodash.isstring';

import {completeAssign} from 'common/utils';
import {SceneController} from 'graphics/scene';
import Rect from 'maths/rect';

export default function Screen(canvas_context) {
	const state = {
		backgroundColor: 'rgba(0, 0, 0, 1)',
		absoluteScale: {x: 1, y: 1},
		scale: {x: 1, y: 1},
		scaleStack: [],
		sceneObjects: []
	};
	return completeAssign(SceneController(state), {
		///////////////////////////////////////////////////////////////////////
		/// Screen metrics
		get width() {
			return canvas_context.canvas.width*state.scale.x;
		},
		set width(w) {
			canvas_context.canvas.width = w/state.scale.x;
		},
		get height() {
			return canvas_context.canvas.height*state.scale.y;
		},
		set height(h) {
			canvas_context.canvas.height = h/state.scale.y;
		},
		size() {
			return {
				width: this.width,
				height: this.height
			};
		},
		setSize({width, height}) {
			this.width = width;
			this.height = height;
			return this;
		},
		localRect() {
			return Rect({x: 0, y: 0}, this.size());
		},
		rect() {
			return this.localRect();
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
			return this;
		},
		drawLine({x: x1, y: y1}, {x: x2, y: y2}) {
			this.beginPath();
			this.moveTo({x: x1, y: y1});
			this.lineTo({x: x2, y: y2});
			this.drawPath();
			return this;
		},
		drawRect({topLeft, topRight, bottomLeft, bottomRight}) {
			this.beginPath();
			this.moveTo(topLeft);
			this.lineTo(topRight);
			this.lineTo(bottomRight);
			this.lineTo(bottomLeft);
			this.closePath();
			this.drawPath();
			return this;
		},
		fillRect({topLeft, topRight, bottomLeft, bottomRight}) {
			this.beginPath();
			this.moveTo(topLeft);
			this.lineTo(topRight);
			this.lineTo(bottomRight);
			this.lineTo(bottomLeft);
			this.closePath();
			this.fillPath();
			return this;
		},
		///////////////////////////////////////////////////////////////////////
		/// Path
		beginPath() {
			canvas_context.beginPath();
			return this;
		},
		closePath() {
			canvas_context.closePath();
			return this;
		},
		moveTo({x, y}) {
			canvas_context.moveTo(x, y);
			return this;
		},
		lineTo({x, y}) {
			canvas_context.lineTo(x, y);
			return this;
		},
		arc({x, y}, radius, start_angle, end_angle, anticlockwise) {
			canvas_context.arc(x, y, radius, start_angle, end_angle, anticlockwise);
			return this;
		},
		drawPath(path) {
			if (is_nil(path)) {
				canvas_context.stroke();
			} else {
				canvas_context.stroke(path);
			}
			return this;
		},
		fillPath(path) {
			if (is_nil(path)) {
				canvas_context.fill();
			} else {
				canvas_context.fill(path);
			}
			return this;
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
			return this;
		},
		///////////////////////////////////////////////////////////////////////
		/// Context save/restore
		save() {
			const {scale, absoluteScale} = state;
			state.scaleStack.push({scale, absoluteScale});
			canvas_context.save();
			return this;
		},
		restore() {
			const {scale, absoluteScale} = state.scaleStack.pop();
			state.scale = scale;
			state.absoluteScale = absoluteScale;
			canvas_context.restore();
			return this;
		},
		///////////////////////////////////////////////////////////////////////
		/// Transformations
		absoluteScale() {
			return state.absoluteScale;
		},
		scale() {
			return state.scale;
		},
		setScale(f) {
			const scale = is_number(f) ? {x: f, y: f} : f;
			state.absoluteScale = {
				x: state.absoluteScale.x*scale.x,
				y: state.absoluteScale.x*scale.y
			};
			state.scale = scale;
			canvas_context.scale(state.scale.x, state.scale.y);
			return this;
		},
		translate({x, y}) {
			canvas_context.translate(x, y);
			return this;
		},
		rotate(angle) {
			canvas_context.rotate(angle);
			return this;
		},
		///////////////////////////////////////////////////////////////////////
		/// Gradient
		createLinearGradient({x: x1, y: y1}, {x: x2, y: y2}, colorStops) {
			const grd = canvas_context.createLinearGradient(x1, y1, x2, y2);
			for (let stop of colorStops) {
				grd.addColorStop(stop.pos, stop.color);
			}
			return grd;
		},
		///////////////////////////////////////////////////////////////////////
		/// Scene
		render() {
			this.brush = state.backgroundColor;
			this.clear();
			for (let child of state.sceneObjects) {
				child.render(this);
			}
			return this;
		},
		scene() {
			return null;
		},
		setBackgroundColor(color) {
			state.backgroundColor = color;
			return this;
		}
	});
}
