import Coordinates from 'graphics/coordinates';
import Scene from 'graphics/scene';

import GraphicsView from 'ui/graphics-view';

import Vector from 'maths/vector';

export default function GameView({model}) {
	const scene = Scene(Coordinates({
		width: model.columns(),
		height: model.rows()
	}, Vector.Null));
	const graphics_view = GraphicsView({
		id: 'screen',
		onBeforeRender(screen) {
			scene.setScale(model.scale());
			screen.reset()
				.setBackgroundColor('#123')
				.setSize(model.size())
				.add(scene);
		},
		model,
		modelEventFilter(event_name, attribute) {
			return event_name === 'changed' && attribute === 'size';
		}
	});
	return Object.assign(graphics_view, {
		scene() {
			return scene;
		}
	});
}
