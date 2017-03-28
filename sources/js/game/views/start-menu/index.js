import {KeyHandler, default as keyboard} from 'ui/keyboard';
import Modal from 'ui/modal';
import View from 'ui/view';

import template from 'game/views/start-menu/template.tmpl';

const gameMenuKeyboardHandler = [
	KeyHandler({
		code: keyboard.KEY_SPACE,
		event: 'spacebar-pressed'
	})
];

export default function GameMenuView({el}) {
	const childView = View({
		id: 'game-ui',
		template
	});
	return Modal({
		el,
		childView,
		onStart(modal) {
			return new Promise(resolve => {
				keyboard
					.use(gameMenuKeyboardHandler)
					.once('spacebar-pressed', () => {
						modal.stop();
						resolve();
					});
			});
		}
	});
}
