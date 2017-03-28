import {PushButton} from 'ui/button';
import View from 'ui/view';

const roles = ['export', 'import', 'play'];

export default function ActionsPalette() {
	const buttons = roles.map(role => PushButton({role}));
	return View({
		id: 'actions',
		tagName: 'ul',
		onBeforeDestroy() {
			for (let button of buttons) {
				button.destroy();
			}
		},
		onRender(view) {
			const el = view.el();
			for (let button of buttons) {
				const item = document.createElement('li');
				item.className = 'item';
				item.appendChild(button.render().el());
				el.appendChild(item);
				button.on('click', action => view.emit('click', action));
			}
		}
	});
}
