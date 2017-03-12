import EventEmitter from 'events';
import {Model as DefaultModel} from 'model';

export function EventForwarder(model, collection) {
	return {
		changed(attr) {
			collection.emit('model-changed', model, attr);
		},
		destroyed() {
			collection.remove(model);
			collection.emit('model-destroyed', model);
		},
		reset() {
			collection.emit('model-reset', model);
		}
	};
}

export default function Collection({
	models = [],
	Model = DefaultModel
} = {}) {
	const collection = new EventEmitter();
	const state = {
		models: new Map()
	};

	function bind(model) {
		const handler = EventForwarder(model, collection);
		for (let event_name of ['changed', 'destroyed', 'reset']) {
			model.on(event_name, handler[event_name]);
		}
		return [model, handler];
	}

	function unbind(model, handler) {
		for (let event_name of ['changed', 'destroyed', 'reset']) {
			model.removeListener(event_name, handler[event_name]);
		}
	}

	function add(models) {
		return models.filter(model => {
			if (!state.models.has(model)) {
				const [, handler] = bind(model);
				state.models.set(model, handler);
				return true;
			}
			return false;
		});
	}

	function remove(models) {
		return (models).filter(model => {
			if (state.models.has(model)) {
				const handler = state.models.get(model);
				unbind(model, handler);
				state.models.delete(model);
				return true;
			}
			return false;
		});
	}

	function clear() {
		for (let [model, handler] of state.models) {
			unbind(model, handler);
			state.delete(model);
		}
	}

	return Object.assign(collection, {
		add(...models) {
			const added = add(models);
			if (added.length > 0) {
				collection.emit('add', added);
			}
			return this;
		},
		clear() {
			clear();
			collection.emit('clear');
			return this;
		},
		create(...args) {
			const model = Model(...args);
			add([model]);
			collection.emit('add', model);
			return this;
		},
		remove(...models) {
			const removed = remove(models);
			if (removed.length > 0) {
				collection.emit('remove', removed);
			}
			return this;
		},
		reset(models) {
			clear();
			add(models);
			collection.emit('reset');
			return this;
		},
		get length() {
			return state.models.size;
		},
		[Symbol.iterator]: () => state.models.keys(),
		forEach(iteratee) {
			state.models.keys().forEach(iteratee);
		},
		filter(predicate) {
			const res = [];
			for (let item of state.models.keys()) {
				if (predicate(item, collection)) {
					res.push(item);
				}
			}
			return res;
		},
		every(predicate) {
			for (let item of state.models.keys()) {
				if (!predicate(item, collection)) {
					return false;
				}
			}
			return true;
		},
		map(iteratee) {
			const res = [];
			for (let item of state.models.keys()) {
				res.push(iteratee(item, collection));
			}
			return res;
		},
		reduce(iteratee, initial_value) {
			let accumulator = initial_value;
			for (let item of state.models.keys()) {
				accumulator = iteratee(accumulator, item, collection);
			}
			return accumulator;
		},
		some(predicate) {
			for (let item of state.models.keys()) {
				if (predicate(item, collection)) {
					return true;
				}
			}
			return false;
		},
		serialize() {
			const res = [];
			for (let item of state.models.keys()) {
				res.push(item.serialize());
			}
			return res;
		}
	}).add(...models);
}
