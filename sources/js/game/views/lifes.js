import {Vaus} from 'game/entities/vaus';

import Coordinates from 'graphics/coordinates';
import Scene from 'graphics/scene';

import Vector from 'maths/vector';

import GraphicsView from 'ui/graphics-view';
import View from 'ui/view';

import times from 'lodash.times';

export function LifeView({model}) {
	const vaus = Vaus(Vector.Null).setMode(Vaus.Mode.Tiny);
	const vaus_size = vaus.size();
	const scene = Scene(Coordinates(vaus_size, Vector.Null));
	return GraphicsView({
		onBeforeRender(screen) {
			const scale = model.scale();
			scene.setScale(scale).reset().add(vaus);
			screen.reset()
				.setBackgroundColor('#123')
				.setSize({width: vaus_size.width*scale, height: vaus_size.height*scale})
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
