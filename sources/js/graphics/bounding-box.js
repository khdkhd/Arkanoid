import Rect from 'maths/rect';
import Vector from 'maths/vector';

export default function BoundingBox({position, size, alignCenterToOrigin = false}) {
	const origin = alignCenterToOrigin
		? pos => pos.add({x: -size.width/2, y: -size.height/2})
		: pos => pos;
	const relative_bbox = Rect(origin(Vector.Null), size);
	return {
		boundingBox: {
			get absolute() {
				return Rect(origin(position), size);
			},
			get relative() {
				return relative_bbox;
			}
		}
	};
}
