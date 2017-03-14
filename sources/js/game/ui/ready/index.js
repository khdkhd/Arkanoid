import {wait} from 'common/utils';
import Modal from 'ui/modal';
import View from 'ui/view';

import template from 'game/ui/ready/template.tmpl';

export default function GameReadyView({el, model}) {
	const childView = View({
		id: 'game-ui',
		model,
		template
	});
	return Modal({
		el,
		childView,
		onStart(modal) {
			wait(1000)
				.then(() => {
					childView.$el('.hidden').forEach(el => el.className = '');
					return wait(1000);
				})
				.then(() => {
					modal.stop();
					model.setState('running');
				});
		}
	});
}
