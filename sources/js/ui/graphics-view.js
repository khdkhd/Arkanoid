import Screen from 'graphics/screen';
import View from 'ui/view';

import noop from 'lodash.noop';
import throttle from 'lodash.throttle';

export function MouseEventsHandler({
	onClick = noop,
	onMouseEnter = noop,
	onMouseLeave = noop,
	onMouseMove = noop,
	throttleWait = 64
} = {}) {
	const mousemove = throttle(
		(ev, el, model) => onMouseMove(ev, el, model),
		throttleWait
	);
	return {
		click(ev, el, model) {
			return onClick(ev, el, model);
		},
		mouseenter(ev, el, model) {
			return onMouseEnter(ev, el, model);
		},
		mouseleave(ev, el, model) {
			mousemove.cancel();
			return onMouseLeave(ev, el, model);
		},
		mousemove
	};
}

export default ({canvas, events = {}} = {}) => {
	const screen = Screen(canvas.getContext('2d'));
	return Object.assign({
		screen() {
			return screen
		}
	}, View({
		el: canvas,
		events,
		onBeforeRender: noop,
		onRender() {
			screen.clear();
			screen.render();
		}
	}));
}
