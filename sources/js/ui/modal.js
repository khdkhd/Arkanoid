import {center} from 'ui/utils';
import View from 'ui/view';

import noop from 'lodash.noop';

export function Overlay() {
	return View({classNames: ['overlay'], onRender: noop});
}

export default ({el, childView} = {}) => {
	const overlay = Overlay();
	return {
		start() {
			el.appendChild(overlay.render().el());
			el.appendChild(childView.render().el());
			center(el.getBoundingClientRect(), childView.el());
		},
		stop() {
			childView.destroy();
			overlay.destroy();
		}
	}
}
