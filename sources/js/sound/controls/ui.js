import is_nil from 'lodash.isnil';
import {
	KeyHandler,
	default as keyboard
} from 'ui/keyboard';

function add_wheel_listener(element, handler) {
	let event_name = 'DOMMouseScroll';
	if (window.hasOwnProperty('onmousewheel')) {
		event_name = 'mousewheel';
	}
	element.addEventListener(event_name, handler);
}

function handle(event, handler){
	event.preventDefault();
	event.stopPropagation();
	handler(event);
}

export default {
	bind_events({
		element,
		mousedown,
		mouseup,
		mousemove,
		mousewheel,
		keypress
	} = {}) {

		element = element || document;

		if (!is_nil(mousemove)) {
			element.addEventListener('mousemove', event => handle(event, mousemove));
		}
		if (!is_nil(mouseup)) {
			element.addEventListener('mouseup', event => handle(event, mouseup));
		}
		if (!is_nil(mousedown)) {
			element.addEventListener('mousedown', event => handle(event, mousedown));
		}
		if (!is_nil(mousewheel)) {
			add_wheel_listener(element, event => handle(event, mousewheel));
		}
		if (!is_nil(keypress)) {
			keyboard.use([KeyHandler({
				code: keypress.code,
				event: keypress.event,
				on_keydown: keypress.keydown,
				on_keyup: keypress.keyup
			})]);
		}
		// return {
		// 	mousemove(handler) {
		// 		element.removeEventListener('mousemove', mousemove);
		// 		element.addEventListener('mousemove', handler);
		// 	},
		// 	mouseup(handler) {
		// 		element.removeEventListener('mouseup', mouseup);
		// 		element.addEventListener('mouseup', handler);
		// 	},
		// 	mousedown(handler) {
		// 		element.removeEventListener('mousedown', mousedown);
		// 		element.addEventListener('mousedown', handler);
		// 	},
		// 	mousewheel(handler) {
		// 		element.removeEventListener('wheel', mousewheel);
		// 		element.addEventListener('wheel', handler);
		// 		element.removeEventListener('mousewheel', mousewheel);
		// 		element.addEventListener('mousewheel', handler);
		// 		element.removeEventListener('DOMMouseScroll', mousewheel);
		// 		element.addEventListener('DOMMouseScroll', handler);
		// 	}
		// }
	}
}
