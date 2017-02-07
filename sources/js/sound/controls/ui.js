import is_nil from 'lodash.isnil';

function add_wheel_listener (element, handler){
	let event_name = 'DOMMouseScroll';
	if(window.hasOwnProperty('onmousewheel')	){
		event_name = 'mousewheel';
	}
	element.addEventListener(event_name, handler);
}

export default {
	bind_events({element, mousedown, mouseup, mousemove, mousewheel} = {}) {

		element = element || document;

		if(!is_nil(mousemove)){
			element.addEventListener('mousemove', mousemove);
		}
		if(!is_nil(mouseup)){
			element.addEventListener('mouseup', mouseup);
		}
		if(!is_nil(mousedown)){
			element.addEventListener('mousedown', mousedown);
		}
		if(!is_nil(mousewheel)){
			add_wheel_listener(element, mousewheel);
		}

		return {
			mousemove(handler) {
				element.removeEventListener('mousemove', mousemove);
				element.addEventListener('mousemove', handler);
			},
			mouseup(handler) {
				element.removeEventListener('mouseup', mouseup);
				element.addEventListener('mouseup', handler);
			},
			mousedown(handler) {
				element.removeEventListener('mousedown', mousedown);
				element.addEventListener('mousedown', handler);
			},
			mousewheel(handler) {
				element.removeEventListener('wheel', mousewheel);
				element.addEventListener('wheel', handler);
				element.removeEventListener('mousewheel', mousewheel);
				element.addEventListener('mousewheel', handler);
				element.removeEventListener('DOMMouseScroll', mousewheel);
				element.addEventListener('DOMMouseScroll', handler);
			}
		}
	}
}
