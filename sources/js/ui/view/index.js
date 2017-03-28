import DOMEventsManager from 'ui/view/dom-events-manager';
import ModelEventsManager from 'ui/view/model-events-manager';

import is_nil from 'lodash.isnil';
import noop from 'lodash.noop';
import uniq from 'lodash.uniq';

import EventEmitter from 'events';

export function defaultOnBeforeRender(view) {
	view.el().innerHTML = '';
}

export function defaultSerializeData(model) {
	if (is_nil(model)) {
		return {};
	}
	return model.serialize();
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

export default function View({
	attributes = {},
	classNames = [],
	el = null,
	domEvents = {},
	modelEvents = {},
	id = '',
	model = null,
	onBeforeDestroy = noop,
	onBeforeRender = defaultOnBeforeRender,
	onRender = noop,
	serializeData = defaultSerializeData,
	tagName = 'div',
	template = null
} = {}) {
	const view = new EventEmitter();
	const state = {
		el,
		domEventsManager: DOMEventsManager(view, domEvents),
		modelEventsManager: ModelEventsManager(view, modelEvents),
		model,
		template
	};
	Object.assign(view, {
		destroy() {
			onBeforeDestroy(view);
			view.removeAllListeners();
			state.domEventsManager.disconnect();
			state.modelEventsManager.disconnect();
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
			view.render();
			return this;
		},
		render() {
			state.el = createElement({el: state.el, attributes, classNames, id, tagName});
			view.disconnect();
			onBeforeRender(view);
			if (!is_nil(state.template)) {
				state.el.innerHTML = template(serializeData(state.model));
			}
			onRender(view);
			view.connect();
			return this;
		},
		connect() {
			state.domEventsManager.connect();
			state.modelEventsManager.connect();
			return this;
		},
		disconnect() {
			state.domEventsManager.disconnect();
			state.modelEventsManager.disconnect();
			return this;
		}
	});
	return view;
}
