import Rect from 'rect';
import Vector from 'vector';

export default function(state, {x, y}, {width, height}, bbox_center = 'center') {
	let pos_ = Vector({x, y});

	const bbox_origin = bbox_center === 'origin'
		? () => pos_.add({x: -width/2, y: -height/2})
		: () => pos_;

	return {
		get pos() {
			return pos_;
		},
		set pos({x, y}) {
			pos_ = Vector({x, y});
		},
		get bbox() {
			return Rect(bbox_origin(), {width, height});
		}
	}
}
