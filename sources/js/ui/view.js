import is_nil from 'lodash.isnil';
import noop from 'lodash.noop';
import uniq from 'lodash.uniq';

export function defaultOnBeforeRender(el) {
	el.innerHTML = '';
}

export function defaultOnDestroy(el) {
	el.remove();
}

export function createElement({el, attributes, classNames, id, tagName}) {
	if (is_nil(el)) {
		el = document.createElement(tagName);
		el.className = uniq(classNames).join(' ');
		el.id = id;
		for (let [key, value] of Object.entries(attributes)) {
			el.setAttribute(key, value);
		}
	}
	return el;
}

export function createEventsManager(state, render) {
	const events_handlers = Object.entries(state.events).map(([event, handler]) => ([
		event,
		ev => {
			if (handler(ev, state.el, state.model)) {
				render();
			}
		}
	]));
	return {
		connect() {
			if (!state.connected) {
				state.connected = true;
				for (let [event, handler] of events_handlers) {
					state.el.addEventListener(event, handler);
				}
				if (!is_nil(state.model)) {
					state.model.on('changed', render);
				}
			}
		},
		disconnect() {
			state.connected = false;
			for (let [event, handler] of events_handlers) {
				state.el.removeEventListener(event, handler);
			}
			if (!is_nil(state.model)) {
				state.model.removeListener('changed', render);
			}
		}
	};
}

export default ({
	el = null,
	classNames = [],
	id = '',
	tagName = 'div',
	attributes = {},
	events = {},
	model = null,
	onBeforeDestroy = noop,
	onBeforeRender = defaultOnBeforeRender,
	onRender = noop
} = {}) => {
	const state = {
		connected: false,
		el: createElement({el, attributes, classNames, id, tagName}),
		events,
		model
	};
	const render = () => {
		const {el, model} = state;
		onBeforeRender(el, model);
		onRender(el, model);
	};
	const {connect, disconnect} = createEventsManager(state, render);
	return ({
		destroy() {
			disconnect();
			onBeforeDestroy(el, model);
			state.el.remove();
		},
		el() {
			return state.el;
		},
		model() {
			return state.model;
		},
		setModel(model) {
			disconnect();
			state.model = model;
			connect();
			render();
			return this;
		},
		render() {
			render();
			return this;
		},
		connect() {
			connect();
			return this;
		},
		disconnect() {
			disconnect();
			return this;
		}
	}).connect();
}
