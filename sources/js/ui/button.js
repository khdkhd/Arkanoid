import View from 'ui/view';

import EventEmitter from 'events';

import is_nil from 'lodash.isnil';
import noop from 'lodash.noop';

export function RadioButton({role, id, name = ''} = {}) {
	const emitter = new EventEmitter();
	return Object.assign(emitter, View({
		id,
		attributes: Object.assign(
			!is_nil(role) ? {'data-role': role} : {},
			{name},
			{type: 'radio'}
		),
		events: {
			change() {
				emitter.emit('click', role);
			}
		},
		onBeforeDestroy() {
			emitter.removeAllListeners();
		},
		onRender: noop,
		tagName: 'input'
	}));
}

export function PushButton({
	role,
	label = '',
	preventDefault = true,
	stopPropagation = true
} = {}) {
	const emitter = new EventEmitter();
	return Object.assign(emitter, View({
		attributes: !is_nil(role) ? {'data-role': role} : {},
		events: {
			click(ev) {
				emitter.emit('click', role);
				if (preventDefault) {
					ev.preventDefault();
				}
				if (stopPropagation) {
					ev.stopPropagation();
				}
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
