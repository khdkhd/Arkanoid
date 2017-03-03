import View from 'ui/view';

import is_nil from 'lodash.isnil';
import noop from 'lodash.noop';

export function RadioButton({role, id, name = ''} = {}) {
	return View({
		id,
		attributes: Object.assign(
			!is_nil(role) ? {'data-role': role} : {},
			{name},
			{type: 'radio'}
		),
		events: {
			change(view) {
				view.emit('click', role);
			}
		},
		onRender: noop,
		tagName: 'input'
	});
}

export function PushButton({
	role,
	label = ''
} = {}) {
	return View({
		attributes: !is_nil(role) ? {'data-role': role} : {},
		events: {
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
