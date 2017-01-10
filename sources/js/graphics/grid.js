import SceneObject from 'graphics/scene-object';

import {EventEmitter} from 'events';
import times from 'lodash.times';

export default function Grid(cols, rows, step, color) {
	return SceneObject({
		zIndex: -Infinity,
		emitter: new EventEmitter(),
		onRender(screen) {
			screen.pen = {
				strokeStyle: color,
				lineWidth: 1/16
			};

			// Vertical guides
			screen.save();
			screen.translate({x: .5/16, y: .5/16});
			times(cols, () => {
				screen.translate({x: step, y: 0});
				screen.drawLine({x: 0, y: 0}, {x: 0, y: rows*step});
			});
			screen.restore();

			// Horizontal guides
			screen.save();
			times(rows, () => {
				screen.translate({x: 0, y: step});
				screen.drawLine({x: 0, y: 0}, {x: cols*step, y: 0});
			});
			screen.restore();
		}
	});
}
