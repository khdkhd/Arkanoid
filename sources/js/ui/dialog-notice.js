import View from 'ui/view';
import {default as Dialog, DialogButtonRoles} from 'ui/dialog';

export default function Notice({
	el = null,
	message = ''
} = {}) {
	const childView = View({
		onRender(el) {
			const p = document.createElement('p');
			p.innerHTML = message;
			el.appendChild(p);
		},
	});
	return Dialog({
		buttons: [DialogButtonRoles.AcceptRole],
		classNames: ['notice'],
		childView,
		el
	});
}
