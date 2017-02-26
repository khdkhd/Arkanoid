import View from 'ui/view';
import {default as Dialog, DialogButtonRoles} from 'ui/dialog';

export default function Confirm({
	el = null,
	question = ''
} = {}) {
	const childView = View({
		onRender(el) {
			const p = document.createElement('p');
			p.innerHTML = question;
			el.appendChild(p);
		},
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
