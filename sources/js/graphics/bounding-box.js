import Rect from 'maths/rect';
import Vector from 'maths/vector';

import identity from 'lodash.identity';

export default function BoundingBox(state) {
	const origin =
		!state.alignCenterToOrigin
			? identity
			: pos => {
				const {width, height} = state.size();
				return pos.add({x: -width/2, y: -height/2});
			};
	const relative_bbox = () => Rect(origin(Vector.Null), state.size());
	return {
		boundingBox: {
			get absolute() {
				return Rect(origin(state.position()), state.size());
			},
			get relative() {
				return relative_bbox();
			}
		}
	};
}
