import View from 'ui/view';
import {default as Dialog, DialogButtonRoles} from 'ui/dialog';

import is_nil from 'lodash.isnil';

export default function Prompt({
	el = null,
	placeholder = null,
	question = ''
} = {}) {
	const input = View({
		attributes: Object.assign({
			type: 'text'
		}, is_nil(placeholder) ? {} : {placeholder}),
		tagName: 'input'
	});
	const childView = View({
		onBeforeDestroy() {
			input.destroy();
		},
		onRender(el) {
			const p = document.createElement('p');
			p.innerHTML = question;
			el.appendChild(p);
			el.appendChild(input.render().el());
		},
	});
	return Dialog({
		aboutToClose(role) {
			if (role === DialogButtonRoles.AcceptRole) {
				return input.el().value || placeholder;
			}
		},
		buttons: [DialogButtonRoles.AcceptRole, DialogButtonRoles.RejectRole],
		classNames: ['prompt'],
		childView,
		el
	});
}
