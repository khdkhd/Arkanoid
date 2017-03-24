import {center} from 'ui/utils';
import View from 'ui/view';

import noop from 'lodash.noop';

export function Overlay() {
	return View({classNames: ['overlay'], onRender: noop});
}

export default ({
	el,
	childView,
	onStart = noop
} = {}) => {
	const overlay = Overlay();
	const view = View({
		el,
		onBeforeRender: noop,
		onRender() {
			const childview_el = childView.render().el();
			el.appendChild(overlay.render().el());
			el.appendChild(childview_el);
			center(el.getBoundingClientRect(), childview_el);
		}
	});
	return Object.assign(view, {
		start() {
			view.render();
			onStart(view);
		},
		stop() {
			overlay.destroy();
			childView.destroy();
		}
	});
}
