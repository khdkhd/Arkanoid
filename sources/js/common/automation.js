import identity from 'lodash.identity';

function square(x) {
	return x*x;
}

function normalized_quadratics_curve(lower, upper) {
	const k = lower*upper - (square(lower) + square(upper))/2;
	return x => 2*(x - lower)*(x - upper)/k;
}

export const easeOut = normalized_quadratics_curve(-1, 1);
export const easeIn = normalized_quadratics_curve(0, 2);

/// Automation clock
///
export function AutomationClock(t0) {
	let current_ = t0;
	return {
		[Symbol.iterator]: function *() {
			do { // eslint-disable-line no-constant-condition
				yield current_;
			} while (true);
		},
		get current() {
			return current_;
		},
		set current(t) {
			current_ = t;
		}
	};
}

/// Automation(duration[, transform = identity])
///
export function Automation(duration, clock, ease = identity) {
	const automation_generator = function* () {
		const t0 = clock.current;
		for (let d = 0; d < duration; d = clock.current - t0) {
			yield ease(d/duration);
			d = clock.current - t0;
		}
	};
	return {
		start() {
			return automation_generator();
		}
	};
}

/// RepeatAutomation(duration[, transform = identity])
///
export function RepeatAutomation(duration, clock, ease = identity) {
	const automation = Automation(duration, clock, ease);
	const automation_generator = function* () {
		do { // eslint-disable-line no-constant-condition
			yield* automation.start(clock.current);
		} while (true);
	};
	return {
		start() {
			return automation_generator();
		}
	}
}

/// CompositeAutomation(duration[, transform = identity])
///
export function CompositeAutomation(...automations) {
	const automation_generator = function* () {
		for (let automation of automations) {
			yield* automation.start();
		}
	};
	return {
		start() {
			return automation_generator();
		}
	}
}
