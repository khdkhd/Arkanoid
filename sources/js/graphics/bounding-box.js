import Rect from 'maths/rect';
import Vector from 'maths/vector';

export default function BoundingBox(state) {
	const origin = state.alignCenterToOrigin
		? pos => pos.add({x: -state.size.width/2, y: -state.size.height/2})
		: pos => pos;
	const relative_bbox = Rect(origin(Vector.Null), state.size);
	return {
		boundingBox: {
			get absolute() {
				return Rect(origin(state.position), state.size);
			},
			get relative() {
				return relative_bbox;
			}
		}
	};
}
