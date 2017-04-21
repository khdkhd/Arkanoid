import {Model} from 'model';
import flatten from 'lodash.flatten';
import noop from 'lodash.noop';

export function CollectionBinder(state) {
	return item => {
		const on_changed = (attr, value) => state.collection.emit('itemChanged', item, attr, value);
		const on_reset   = () => state.collection.emit('itemReset', item);
		const on_destroy = () => {
			state.items.delete(item);
			state.collection.emit('itemDestroyed', item);
		};
		return item
			.on('changed', on_changed)
			.on('reset', on_reset)
			.once('destroyed', on_destroy);
	};
}

export function CollectionInserter(state) {
	const bind = CollectionBinder(state);
	return items => {
		items = items.filter(item => !state.items.has(item));
		items.forEach(item => {
			state.items.add(item);
			bind(item, state);
			state.collection.emit('itemAdded', item);
		});
		return items;
	};
}

export function CollectionClearer(state) {
	return () => {
		for (let item of state.items) {
			state.items.delete(item);
			item.destroy();
		}
	};
}

export default function Collection({
	attributes = {},
	items = [],
	ItemModel = Model,
	onBeforeDestroy = noop
} = {}) {
	const state = {
		items: new Set(items),
		collection: new Model({
			attributes,
			onBeforeDestroy(collection) {
				onBeforeDestroy(collection);
				collection.clear();
			}
		})
	};

	const {reset, serialize} = state.collection;
	const add = CollectionInserter(state);
	const clear = CollectionClearer(state);

	return Object.assign(state.collection, {
		add(...items) {
			add(flatten(items));
			return this;
		},
		create(...args) {
			const item = ItemModel(...args);
			add([item]);
			return this;
		},
		reset(items = []) {
			clear();
			reset(); // call Model.reset
			add(items);
			return this;
		},
		size() {
			return state.items.size;
		},
		[Symbol.iterator]: () => state.items.values(),
		find(predicate) {
			for (let item of state.items) {
				if (predicate(item, state.collection)) {
					return item;
				}
			}
		},
		forEach(iteratee) {
			for (let item of state.items) {
				iteratee(item);
			}
		},
		filter(predicate) {
			const res = [];
			for (let item of state.items) {
				if (predicate(item, state.collection)) {
					res.push(item);
				}
			}
			return res;
		},
		every(predicate) {
			for (let item of state.items) {
				if (!predicate(item, state.collection)) {
					return false;
				}
			}
			return true;
		},
		map(iteratee) {
			const res = [];
			for (let item of state.items) {
				res.push(iteratee(item, state.collection));
			}
			return res;
		},
		reduce(iteratee, initial_value) {
			let accumulator = initial_value;
			for (let item of state.items) {
				accumulator = iteratee(accumulator, item, state.collection);
			}
			return accumulator;
		},
		some(predicate) {
			for (let item of state.items) {
				if (predicate(item, state.collection)) {
					return true;
				}
			}
			return false;
		},
		serialize() {
			return Object.assign(
				serialize(),
				{items: state.collection.map(item => item.serialize())}
			);
		}
	});
}
