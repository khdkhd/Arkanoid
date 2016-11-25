import identity from 'lodash.identity';
import is_nil from 'lodash.isnil';
import first from 'lodash.first';

/// Automation clock
///
export function Clock(t0) {
	let current_ = t0;
	return {
		[Symbol.iterator]: function*() {
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

const AUTOMATION_GENERATOR_SYMBOL = Symbol();

/// Automation(duration[, transform = identity])
///
export function Automation(duration, clock, ease = identity, fallback) {
	let t0;
	let generator;

	const create_generator = function* () {
		for (let d = 0;  d < duration; d = clock.current - t0) {
			yield ease(d/duration);
		}
	};
	const is_running = () => !is_nil(generator);
	const reset = () => t0 = clock.current;
	const start = () => {
		reset();
		generator = create_generator();
	};
	const stop = () => {
		generator = null;
	};

	return {
		reset() {
			reset();
			return this;
		},
		start() {
			start();
			return this;
		},
		stop() {
			stop();
			return this;
		},
		get isRunning() {
			return is_running();
		},
		get value() {
			if (is_running()) {
				const v = generator.next().value;
				if (!is_nil(v)) {
					return v;
				}
				stop();
			}
			if (!is_nil(fallback)) {
				return fallback;
			}
		},
		[AUTOMATION_GENERATOR_SYMBOL]: function* () {
			start();
			yield* generator;
		}
	};
}

/// RepeatAutomation(duration[, transform = identity])
///
export function RepeatAutomation(automation) {
	let generator;
	let running = false;

	const create_generator = function*() {
		while (running) {
			yield* automation[AUTOMATION_GENERATOR_SYMBOL]();
		}
	};
	const is_running = () => running || automation.isRunning;
	const start = () => {
		running = true;
		generator = create_generator();
	}
	return {
		reset() {
			automation.reset();
			return this;
		},
		start() {
			start();
			return this;
		},
		stop() {
			running = false;
			automation.stop();
			return this;
		},
		completeAndStop() {
			running = false;
			return this;
		},
		get isRunning() {
			return running || automation.isRunning;
		},
		get value() {
			if (is_running()) {
				return generator.next().value;
			}
			return automation.value;
		},
		[AUTOMATION_GENERATOR_SYMBOL]: function* () {
			start();
			yield* generator;
		}
	}
}

/// SequenceAutomation(duration[, transform = identity])
///
export function SequenceAutomation(...automations) {
	let running = false;
	let current = 0;
	let generator;

	const create_generator = function* () {
		for (;running && current < automations.length; ++current) {
			const automation = automations[current];
			automation.start();
			for (let value of automation[AUTOMATION_GENERATOR_SYMBOL]()) {
				yield value;
			}
		}
	};
	const is_running = () => running || automations.some(a => a.isRunning);
	const reset = () => {
		current = 0;
		automations.forEach(a => a.stop());
		generator = create_generator();
	};
	const start = () => {
		reset();
		running = true;
		generator = create_generator();
	};

	return {
		reset() {
			reset();
			return this;
		},
		start() {
			start();
			return this;
		},
		stop() {
			reset();
			running = false;
			return this;
		},
		completeAndStop() {
			running = false;
			return this;
		},
		get isRunning() {
			return is_running();
		},
		get value() {
			if (is_running()) {
				const v =  generator.next().value;
				if (!is_nil(v)) {
					return v;
				}
			}
			// maybe a fallback value ?
			return (first(automations, a => is_nil(a.value))).value;
		},
		[AUTOMATION_GENERATOR_SYMBOL]: function* () {
			start();
			yield* generator;
		}
	}
}

/// CompositeAutomation(automations)
///
export function CompositeAutomation(automations) {
	const is_running = () => {
		return Object.values(automations).some(automation => {
			return automation.isRunning;
		});
	};

	const values = Object.entries(automations).reduce((prop_values, [prop, a]) => {
		const prop_value = Object.create({}, {[prop]: {
			get: () => a,
			enumerable: true
		}});
		return Object.assign(prop_values, prop_value);
	}, {});

	return Object.assign({
		reset(prop) {
			if (is_nil(prop)) {
				Object.values(automations).forEach(a => a.reset());
			} else {
				automations[prop].reset();
			}
			return this;
		},
		start(prop) {
			if (is_nil(prop)) {
				Object.values(automations).forEach(a => a.start());
			} else {
				automations[prop].reset();
			}
			return this;
		},
		stop(prop) {
			if (is_nil(prop)) {
				Object.values(automations).forEach(a => a.stop());
			} else {
				automations[prop].stop();
			}
			return this;
		},
		get isRunning() {
			return is_running();
		},
		get value() {
			return Object.entries(automations).reduce((v, [prop, a]) => {
				return Object.assign(v, {[prop]: a.value});
			}, {});
		}
	}, values);
}
