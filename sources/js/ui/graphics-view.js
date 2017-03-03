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
		(view, ev) => onMouseMove(view, ev),
		throttleWait
	);
	return {
		click(view, ev) {
			return onClick(view, ev);
		},
		mouseenter(view, ev) {
			return onMouseEnter(view, ev);
		},
		mouseleave(view, ev) {
			mousemove.cancel();
			return onMouseLeave(view, ev);
		},
		mousemove
	};
}

export default function GraphicsView({canvas, events = {}} = {}) {
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
