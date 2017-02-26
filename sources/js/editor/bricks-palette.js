import {RadioButton} from 'ui/button';
import View from 'ui/view';

import EventEmitter from 'events';

const colors = ['gold', 'white', 'orange', 'cyan', 'green', 'red', 'blue', 'purple', 'yellow', 'gray'];

function BricksPaletteButtonLabel({name}) {
	return View({
		tagName: 'label',
		attributes: {
			'for': name
		}
	});
}

export default function BricksPalette({el}) {
	const emitter = new EventEmitter();
	const bricks = colors.map(color => ({
		button: RadioButton({id: color, name: 'brick', role: color}),
		label: BricksPaletteButtonLabel({name: color})
	}));
	return Object.assign(emitter, View({
		el,
		onBeforeDestroy() {
			for (let {button, label} of bricks) {
				button.destroy();
				label.destroy();
			}
		},
		onRender(el) {
			for (let {button, label} of bricks) {
				const item = document.createElement('li');
				item.className = 'item';
				item.appendChild(button.render().el());
				item.appendChild(label.render().el());
				el.appendChild(item);
				button.on('click', color => emitter.emit('click', color));
			}
		}
	}));
}
