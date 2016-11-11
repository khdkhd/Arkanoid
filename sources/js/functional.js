import is_nil from 'lodash.isnil';

/// functional.dispatch(...fns)
/// Returns a function which calls each given functions with its arguments
/// until one return a thruthy value.
/// **Parameters:**
/// - ...fns, some `Function`
/// **Returns:**
/// - a `Function`
export function dispatch(...fns) {
	return (...args) => {
		for (let fn of fns) {
			const v = fn(...args);
			if (!is_nil(v)) {
				return v;
			}
		}
	};
}
