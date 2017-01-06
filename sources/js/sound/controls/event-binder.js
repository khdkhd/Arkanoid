import is_nil from 'lodash.isnil';

export default ({mousedown, mouseup, mousemove} = {}) => {

	if(!is_nil(mousemove)){
		document.addEventListener('mousemove', mousemove);
	}
	if(!is_nil(mouseup)){
		document.addEventListener('mouseup', mouseup);
	}
	if(!is_nil(mousedown)){
		document.addEventListener('mousedown', mousedown);
	}

	return {
		mousemove(handler) {
			document.removeEventListener('mousemove', mousemove);
			document.addEventListener('mousemove', handler);
		},
		mouseup(handler) {
			document.removeEventListener('mouseup', mouseup);
			document.addEventListener('mouseup', handler);
		},
		mousedown(handler) {
			document.removeEventListener('mousedown', mousedown);
			document.addEventListener('mousedown', handler);
		}
	}
}
