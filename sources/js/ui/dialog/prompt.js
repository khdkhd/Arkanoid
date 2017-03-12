import View from 'ui/view';
import {default as Dialog, DialogButtonRoles} from 'ui/dialog';
import template from 'ui/dialog/prompt.tmpl';

export default function Prompt({
	el = null,
	placeholder = null,
	question = ''
} = {}) {
	const childView = View({
		serializeData: () => ({
			placeholder,
			question
		}),
		template
	});
	return Dialog({
		aboutToClose(role) {
			if (role === DialogButtonRoles.AcceptRole) {
				return childView.$el('input')[0].value || placeholder;
			}
		},
		buttons: [DialogButtonRoles.AcceptRole, DialogButtonRoles.RejectRole],
		classNames: ['prompt'],
		childView,
		el
	});
}
