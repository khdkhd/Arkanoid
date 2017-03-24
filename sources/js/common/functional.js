import is_nil from 'lodash.isnil';
import matches from 'lodash.matches';

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

/// functional.matcher(...sources)
/// Creates a function that performs a partial deep comparison between its
/// arguments sources, returning true if the given objects has equivalent
/// properties values, else false.
/// **Parameters:**
/// - ...sources, some values
/// **Returns:**
/// - `Boolean`
/// **Example:**
/// ```js
/// const match = functional.matcher('foo', 'bar');
/// match('foo', 'bar')
/// // => return true
/// match('boo', 'far')
/// // => return false
/// ```
export function matcher(...sources) {
	const fn = matches(sources);
	return (...args) => fn(args);
}
