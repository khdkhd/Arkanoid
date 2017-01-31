import is_nil from 'lodash.isnil';


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
		if(!is_nil(mousedown)){
			element.addEventListener('mousewheel', mousedown);
		}
		if(!is_nil(mousewheel)){
			element.addEventListener('mousewheel', mousewheel);
			element.addEventListener('DOMMouseScroll', mousewheel);
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
				element.removeEventListener('mousewheel', mousewheel);
				element.removeEventListener('DOMMouseScroll', mousewheel);
				element.addEventListener('mousewheel', handler);
				element.addEventListener('DOMMouseScroll', handler);
			}
		}
	}
}
