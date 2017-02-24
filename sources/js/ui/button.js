import View from 'ui/view';
import EventEmitter from 'events';
import is_nil from 'lodash.isnil';

export default ({role, label = ''} = {}) => {
	const emitter = new EventEmitter();
	return Object.assign(emitter, View({
		attributes: is_nil(role) ? {'data-role': role} : {},
		events: {
			click() {
				emitter.emit('click', role);
			}
		},
		onBeforeDestroy() {
			emitter.removeAllListeners();
		},
		onRender(el) {
			el.innerHTML = label;
		},
		tagName: 'button'
	}));
}
