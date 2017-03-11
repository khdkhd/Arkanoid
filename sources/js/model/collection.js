import EventEmitter from 'events';
import {Model as DefaultModel} from 'model';

function EventForwarder(model, state) {
	return {
		changed(attr) {
			state.emitter.emit('model-changed', attr, model);
		},
		reset() {
			state.emitter.emit('model-reset', model);
		}
	};
}

export default function Collection({
	models = [],
	Model = DefaultModel
} = {}) {
	const state = {
		emitter: new EventEmitter(),
		models: Map()
	};

	function bind(model) {
		const handler = EventForwarder(model, state);
		model
			.on('changed', handler.changed)
			.on('reset', handler.reset);
		return [model, handler];
	}

	function unbind(model, handler) {
		model
			.removeListener('changed', handler.changed)
			.removeListener('reset', handler.reset);
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

	return Object.assign(state.emitter, {
		add(...models) {
			const added = add(models);
			if (added.length > 0) {
				state.emitter.emit('add', added);
			}
			return this;
		},
		clear() {
			clear();
			state.emitter.emit('clear');
			return this;
		},
		create(...args) {
			const model = Model(...args);
			add([model]);
			state.emitter.emit('add', model);
			return this;
		},
		remove(...models) {
			const removed = remove(models);
			if (removed.length > 0) {
				state.emitter.emit('remove', removed);
			}
			return this;
		},
		reset(models) {
			clear();
			add(models);
			state.emitter.emits('reset');
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
			return state.models.keys().filter(predicate);
		},
		every(predicate) {
			return state.models.keys().every(predicate);
		},
		map(iteratee) {
			return state.models.keys().map(iteratee);
		},
		reduce(iteratee, initial_value) {
			return state.models.keys().reduce(iteratee, initial_value);
		},
		some(predicate) {
			return state.models.keys().some(predicate);
		},
		serialize() {
			return state.models.keys().map(model => model.serialize());
		}
	}).add(...models);
}
