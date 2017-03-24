import {VausView} from 'game/entities/vaus';

import Coordinates from 'graphics/coordinates';
import Scene from 'graphics/scene';

import Vector from 'maths/vector';

import GraphicsView from 'ui/graphics-view';
import View from 'ui/view';

import times from 'lodash.times';

export function LifeView({model}) {
	const coordinates = Coordinates({width: 3, height: 1}, Vector.Null);
	const scene = Scene(coordinates);
	const vaus = VausView({coordinates, padSize: 1});
	return GraphicsView({
		onBeforeRender(screen) {
			const scale = model.scale();
			scene.setScale(scale).reset().add(vaus);
			screen.reset()
				.setBackgroundColor('#123')
				.setSize({width: 3*scale, height: scale})
				.add(scene);
		},
	});
}

export default function LifesView({model}) {
	let lifes = [];
	return View({
		id: 'lifes',
		tagName: 'ul',
		model,
		modelEvents: {
			changed(attr, value, view) {
				if (attr === 'size' || attr === 'lifes') {
					view.render();
				}
			}
		},
		onRender(view) {
			const el = view.el();
			lifes.forEach(life => life.destroy());
			lifes = [];
			times(view.model().lifeCount(), index => {
				lifes.push(LifeView({model}));

				const item = document.createElement('li');

				item.className = 'life';
				item.appendChild(lifes[index].render().el());

				el.appendChild(item);
			});
		}
	});
}
