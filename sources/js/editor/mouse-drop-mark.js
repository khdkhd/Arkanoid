import SceneObject from 'graphics/scene-object';

import Rect from 'maths/rect';
import Vector from 'maths/vector';

import constant from 'lodash.constant';

const mouse_drop_mark_color = 'hsla(210, 50%, 50%, .5)';

export default () => {
	const pos = Vector({x: 2, y: 2});
	const size = {
		width: 2,
		height: 1
	};
	const coordinates = {
		position: constant(pos),
		localRect: constant(Rect({x: 0, y: 0}, size)),
		rect: constant(Rect(pos, size)),
		size: constant(size)
	};
	return Object.assign(SceneObject(coordinates, {
		onRender(screen, scene, rect) {
			screen.brush = mouse_drop_mark_color;
			screen.fillRect(rect);
		},
		zIndex: 2
	}), {
		setPosition({x, y}) {
			pos.x = x,
			pos.y = y
		}
	});
}
