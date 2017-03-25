import GameModel from 'game/model';

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

export default function GameMenuView({el, model}) {
	const childView = View({
		id: 'game-ui',
		template
	});
	return Modal({
		el,
		childView,
		onStart(modal) {
			keyboard
				.use(gameMenuKeyboardHandler)
				.once('spacebar-pressed', () => {
					model.setlifes(3);
					model.setStage(1);
					model.setState(GameModel.state.Ready);
					modal.stop();
				});
		}
	});
}
