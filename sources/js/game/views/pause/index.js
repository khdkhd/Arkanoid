import GameModel from 'game/model';
import {KeyHandler, default as keyboard} from 'ui/keyboard';
import Modal from 'ui/modal';
import View from 'ui/view';

import template from 'game/views/pause/template.tmpl';

const gamePauseKeyboardHandler = [
	KeyHandler({
		code: keyboard.KEY_P,
		event: 'continue'
	})
];

export default function PauseMenuView({el, model}) {
	const childView = View({
		id: 'game-ui',
		template
	});
	return Modal({
		el,
		childView,
		onStart(modal) {
			keyboard
				.use(gamePauseKeyboardHandler)
				.once('continue', () => {
					modal.stop();
					model.setState(GameModel.state.Running);
				});
		}
	});
}
