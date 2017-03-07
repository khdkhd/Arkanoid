import View from 'ui/view';
import {default as Dialog, DialogButtonRoles} from 'ui/dialog';
import template from 'ui/dialog/notice.tmpl';

export default function Notice({
	el = null,
	message = ''
} = {}) {
	const childView = View({
		serializeData: () => ({message}),
		template
	});
	return Dialog({
		buttons: [DialogButtonRoles.AcceptRole],
		classNames: ['notice'],
		childView,
		el
	});
}
