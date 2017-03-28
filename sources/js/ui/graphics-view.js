import Screen from 'graphics/screen';
import {default as View, createElement} from 'ui/view';

import noop from 'lodash.noop';
import throttle from 'lodash.throttle';

export function MouseEventsHandler({
	onClick = noop,
	onMouseDown = noop,
	onMouseUp = noop,
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
		mousedown(view, ev) {
			return onMouseDown(view, ev);
		},
		mouseup(view, ev) {
			return onMouseUp(view, ev);
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

export default function GraphicsView({
	attributes = {},
	classNames = [],
	canvas = null,
	id = '',
	modelEvents = {},
	domEvents = {},
	onBeforeRender = noop,
	model,
	modelEventFilter = noop
} = {}) {
	const el = createElement({el: canvas, attributes, classNames, id, tagName: 'canvas'});
	const screen = Screen(el.getContext('2d'));
	return Object.assign(View({
		el,
		domEvents,
		modelEvents,
		onBeforeRender() {
			onBeforeRender(screen);
		},
		onRender() {
			screen.clear().render();
		},
		model,
		modelEventFilter
	}), {
		screen() {
			return screen;
		}
	});
}
