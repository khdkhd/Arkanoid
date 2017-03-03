import is_function from 'lodash.isfunction';
import is_nil from 'lodash.isnil';
import noop from 'lodash.noop';
import uniq from 'lodash.uniq';

import EventEmitter from 'events';

export function defaultOnBeforeRender(el) {
	el.innerHTML = '';
}

export function defaultOnDestroy(el) {
	el.remove();
}

export function defaultSerializeData(model) {
	if (is_nil(model)) {
		return {};
	}
	return model.toJSON();
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

export function createEventHandler(eventName, descriptor, view) {
	const state = Object.assign({
		preventDefault: true,
		stopPropagation: true,
		selector: null
	}, !is_function(descriptor) ? descriptor : {
		handler: descriptor,
		eventName
	});
	return {
		callback(ev) {
			if (state.preventDefault) {
				ev.preventDefault();
			}
			if (state.stopPropagation) {
				ev.stopPropagation();
			}
			state.handler(view, ev);
		},
		eventName,
		selector: state.selector
	};
}

export function createEventsManager(view, events) {
	const handlers = Object.entries(events).map(([eventName, descriptor]) => {
		return createEventHandler(eventName, descriptor, view);
	});
	const modelEventHandler = () => view.render();
	let connected = false;
	return {
		connect() {
			if (connected) return ;
			for (let {callback, eventName, selector} of handlers) {
				view
					.$el(selector)
					.forEach(el => el.addEventListener(eventName, callback));
			}
			const model = view.model();
			if (!is_nil(model)) {
				model.on('changed', modelEventHandler);
			}
			connected = true;
		},
		disconnect() {
			if (!connected) return;
			for (let {callback, eventName, selector} of handlers) {
				view
					.$el(selector)
					.forEach(el => el.removeEventListener(eventName, callback));
			}
			const model = view.model();
			if (!is_nil(model)) {
				model.removeListener('changed', modelEventHandler);
			}
			connected = false;
		}
	};
}

export default ({
	attributes = {},
	classNames = [],
	el = null,
	events = {},
	id = '',
	model = null,
	onBeforeDestroy = noop,
	onBeforeRender = defaultOnBeforeRender,
	onRender = noop,
	serializeData = defaultSerializeData,
	tagName = 'div',
	template = null
} = {}) => {
	const view = new EventEmitter();
	const state = {
		el,
		eventsManager: createEventsManager(view, events),
		model,
		template
	};
	const render = () => {
		state.el = createElement({el: state.el, attributes, classNames, id, tagName});
		state.eventsManager.disconnect();
		onBeforeRender(view);
		if (!is_nil(state.template)) {
			state.el.innerHTML = template(serializeData(state.model));
		}
		onRender(view);
		state.eventsManager.connect();
	};
	Object.assign(view, {
		destroy() {
			onBeforeDestroy(view);
			view.removeAllListeners();
			state.eventsManager.disconnect();
			state.el.remove();
		},
		el() {
			return state.el;
		},
		$el(selector) {
			const el = state.el;
			if (is_nil(selector)) {
				return [el];
			}
			return el.querySelectorAll(selector);
		},
		model() {
			return state.model;
		},
		setModel(model) {
			state.model = model;
			render();
			return this;
		},
		render() {
			render();
			return this;
		},
		connect() {
			state.eventsManager.connect();
			return this;
		},
		disconnect() {
			state.eventsManager.disconnect();
			return this;
		}
	});
	return view;
}
