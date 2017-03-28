import is_nil from 'lodash.isnil';

export function createEventHandlers(view, events) {
	events = Object.assign({}, {
		changed: () => view.render(),
		reset:   () => view.render(),
		destroy: () => view.destroy()
	}, events);
	return Object.assign.apply(
		null,
		Object.entries(events).map(([event_name, handler]) => ({
			[event_name]: (...args) => {
				handler.apply(view, args.concat(view));
			}
		}))
	);
}

export default function ModelEventsManager(view, events) {
	const handlers = createEventHandlers(view, events);
	let connected = false;
	return {
		connect() {
			const model = view.model();
			if (!(connected || is_nil(model))) {
				connected = true;
				Object.entries(handlers).forEach(([event_name, callback]) => {
					model.on(event_name, callback);
				});
			}
		},
		disconnect() {
			const model = view.model();
			if (connected && !is_nil(model)) {
				connected = false;
				Object.entries(handlers).forEach(([event_name, callback]) => {
					model.removeListener(event_name, callback);
				});
			}
		}
	};
}
