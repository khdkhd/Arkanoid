import is_nil from 'lodash.isnil';

export function createEventHandlers(view, events) {
	events = Object.assign({}, {
		changed: () => view.render(),
		reset:   () => view.render(),
		destroy: () => view.destroy()
	}, events);
	return {
		changed(attr, value) {
			events.changed(attr, value, view);
		},
		reset() {
			events.reset(view);
		},
		destroy() {
			events.destroy(view);
		}
	}
}

export default function ModelEventsManager(view, events) {
	const handlers = createEventHandlers(view, events);
	let connected = false;
	return {
		connect() {
			const model = view.model();
			if (!(connected || is_nil(model))) {
				connected = true;
				model
					.on('changed', handlers.changed)
					.on('reset', handlers.reset)
					.on('destroy', handlers.destroy);
			}
		},
		disconnect() {
			const model = view.model();
			if (connected && !is_nil(model)) {
				connected = false;
				model
					.removeListener('changed', handlers.changed)
					.removeListener('reset', handlers.reset)
					.removeListener('destroy', handlers.destroy);
			}
		}
	};
}
