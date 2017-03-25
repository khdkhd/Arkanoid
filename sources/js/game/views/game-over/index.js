import {wait} from 'common/utils';

import Modal from 'ui/modal';
import View from 'ui/view';

import template from 'game/views/game-over/template.tmpl';

export default function PauseMenuView({el}) {
	const childView = View({
		id: 'game-ui',
		template
	});
	return Modal({
		el,
		childView,
		onStart(modal) {
			return wait(2000)
				.then(() => {
					modal.stop();
				});
		}
	});
}
