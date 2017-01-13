import is_nil from 'lodash.isnil';


export default {
	bind_events({mousedown, mouseup, mousemove} = {}) {

		const canvas = document.getElementById('screen');

		if(!is_nil(mousemove)){
			canvas.addEventListener('mousemove', mousemove);
		}
		if(!is_nil(mouseup)){
			canvas.addEventListener('mouseup', mouseup);
		}
		if(!is_nil(mousedown)){
			canvas.addEventListener('mousedown', mousedown);
		}

		return {
			mousemove(handler) {
				canvas.removeEventListener('mousemove', mousemove);
				canvas.addEventListener('mousemove', handler);
			},
			mouseup(handler) {
				canvas.removeEventListener('mouseup', mouseup);
				canvas.addEventListener('mouseup', handler);
			},
			mousedown(handler) {
				canvas.removeEventListener('mousedown', mousedown);
				canvas.addEventListener('mousedown', handler);
			}
		}
	}
}
