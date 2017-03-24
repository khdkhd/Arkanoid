import EventEmitter from 'events';

import is_string from 'lodash.isstring';
import noop from 'lodash.noop';

/**
 * @module model
 */

/**
 * Create a model given some initial attributes value.
 * @param {[type]} attributes [description]
 */
export default function Model({
	attributes,
	onBeforeDestroy = noop,
} = {}) {
	const model = new EventEmitter();
	const state = {
		attributes: Object.assign({}, attributes)
	};
	return Object.assign(model, {
		/**
		 * Returns the attribute of this model as a plain object.
		 * @return {Object} - This model's attributes.
		 */
		attributes() {
			return Object.assign({}, state.attributes);
		},
		/**
		 * Returns the attribute of this model as a plain object.
		 * @return {Object} - This model's attributes.
		 */
		serialize() {
			return Object.assign({}, state.attributes);
		},
		destroy() {
			onBeforeDestroy(model);
			model.emit('destroyed');
			return this;
		},
		/**
		 * Returns the value of the given attribute value of this model.
		 * @param  {String} attr - The property name.
		 * @return {mixed} - The value of the specified attribute or
		 * `undefined` if it does not exist.
		 */
		get(attr) {
			return state.attributes[attr];
		},
		/**
		 * Set one or severa attributes of this model.
		 * @param {String|Object} attr - If `attr` is a `String` then it
		 * represent the name of the attribute to be changed. If `attr` is an
		 * `Object` then it is that object will with the existing attributes of
		 * this model.
		 * @param {mixed} value - The value to be set to the attribute. If
		 * `attr` is an object, this parameter is ignored.
		 * @emits Model#changed
		 * @return {Model} - This model.
		 */
		set(attr, value) {
			if (is_string(attr)) {
				attr = {[attr]: value};
			}
			Object.assign(state.attributes, attr);
			/**
			 * Indicates that some attributes have been updated.
			 * @event Model#changed
			 * @type {String} - The name of the updated attribute.
			 */
			for (let [key, value] of Object.entries(attr)) {
				model.emit('changed', key, value);
			}
			return this;
		},
		/**
		 * Resets this model's attributes with the values given when it was
		 * created.
		 * @emits Model#reset
		 * @return {Model} - This model.
		 */
		reset() {
			state.attributes = Object.assign({}, attributes);
			/**
			 * Indicates that this model has been re-initialized.
			 * @event Model#reset
			 */
			model.emit('reset');
			return this;
		}
	});
}
