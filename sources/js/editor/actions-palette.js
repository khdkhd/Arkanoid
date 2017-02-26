import {PushButton} from 'ui/button';
import View from 'ui/view';

import EventEmitter from 'events';

const roles = ['export', 'import'];

export default function ActionsPalette({el}) {
	const emitter = new EventEmitter();
	const buttons = roles.map(role => PushButton({role}));
	return Object.assign(emitter, View({
		el,
		onBeforeDestroy() {
			for (let button of buttons) {
				button.destroy();
			}
		},
		onRender(el) {
			for (let button of buttons) {
				const item = document.createElement('li');
				item.className = 'item';
				item.appendChild(button.render().el());
				el.appendChild(item);
				button.on('click', action => emitter.emit('click', action));
			}
		}
	}));
}
