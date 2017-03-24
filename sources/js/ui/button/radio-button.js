import View from 'ui/view';

import is_nil from 'lodash.isnil';
import noop from 'lodash.noop';

export default function RadioButton({
	role,
	id,
	name = ''
} = {}) {
	return View({
		id,
		attributes: Object.assign(
			!is_nil(role) ? {'data-role': role} : {},
			{name},
			{type: 'radio'}
		),
		domEvents: {
			change(view) {
				view.emit('click', role);
			}
		},
		onRender: noop,
		tagName: 'input'
	});
}
