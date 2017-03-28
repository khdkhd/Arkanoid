import View from 'ui/view';

import is_nil from 'lodash.isnil';

export default function PushButton({
	role,
	label = ''
} = {}) {
	return View({
		attributes: !is_nil(role) ? {'data-role': role} : {},
		domEvents: {
			click(view) {
				view.emit('click', role);
			}
		},
		onRender(view) {
			view.el().innerHTML = label;
		},
		tagName: 'button'
	});
}
