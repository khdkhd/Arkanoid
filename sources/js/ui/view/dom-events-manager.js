import is_function from 'lodash.isfunction';

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

export default function DOMEventsManager(view, events) {
	const handlers = Object.entries(events).map(([eventName, descriptor]) => {
		return createEventHandler(eventName, descriptor, view);
	});
	let connected = false;
	return {
		connect() {
			if (!connected) {
				connected = true;
				for (let {callback, eventName, selector} of handlers) {
					view
						.$el(selector)
						.forEach(el => el.addEventListener(
							eventName,
							callback
						));
				}
			}
		},
		disconnect() {
			if (connected) {
				connected = false;
				for (let {callback, eventName, selector} of handlers) {
					view
						.$el(selector)
						.forEach(el => el.removeEventListener(
							eventName,
							callback
						));
				}
			}
		}
	};
}
