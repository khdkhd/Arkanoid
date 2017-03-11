import EventEmitter from 'events';
import {Model as DefaultModel} from 'model';

function EventForwarder(model, state) {
	return {
		changed(attr) {
			state.emitter.emit('changed', attr, model);
		},
		reset() {
			state.emitter.emit('reset', model);
		}
	};
}

export default function Collection({
	Model = DefaultModel
} = {}) {
	const state = {
		emitter: new EventEmitter(),
		models: Map()
	};
	const bind = model => {
		const handler = EventForwarder(model, state);
		model
			.on('changed', handler.changed)
			.on('reset', handler.reset);
		return [model, handler];
	};
	const unbind = (model, handler) => {
		model
			.removeListener('changed', handler.changed)
			.removeListener('reset', handler.reset);
	};
	return Object.assign(state.emitter, {
		add(...models) {
			for (let model of models) {
				if (!state.models.has(model)) {
					const [, handler] = bind(model);
					state.models.set(model, handler);
					state.emitter.emit('add', model);
				}
			}
			return this;
		},
		clear() {
			for (let [model, handler] of state.models) {
				unbind(model, handler);
				state.delete(model);
			}
			state.emitter.emit('clear');
			return this;
		},
		create(...args) {
			const [model, handler] = bind(Model(...args));
			state.models.set(model, handler);
			state.emitter.emit('add', model);
			return this;
		},
		remove(...models) {
			for (let model of models) {
				if (state.models.has(model)) {
					const handler = state.models.get(model);
					unbind(model, handler);
					state.models.delete(model);
					state.emitter.emit('remove', model);
				}
			}
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
			return state.models.filter(predicate);
		},
		every(predicate) {
			return state.models.every(predicate);
		},
		map(iteratee) {
			return state.models.keys().map(iteratee);
		},
		reduce(iteratee, initial_value) {
			return state.models.reduce(iteratee, initial_value);
		},
		some(predicate) {
			return state.models.some(predicate);
		}
	});
}
