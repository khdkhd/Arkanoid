import View from 'ui/view';
import {default as Dialog, DialogButtonRoles} from 'ui/dialog';
import template from 'ui/dialog/confirm.tmpl';

export default function Confirm({
	el = null,
	question = ''
} = {}) {
	const childView = View({
		serializeData: () => ({question}),
		template
	});
	return Dialog({
		aboutToClose(role) {
			return role === DialogButtonRoles.YesRole;
		},
		buttons: [DialogButtonRoles.YesRole, DialogButtonRoles.NoRole],
		classNames: ['prompt'],
		childView,
		el
	});
}
