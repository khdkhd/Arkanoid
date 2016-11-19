import identity from 'lodash.identity';

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

/// Automation(duration[, transform = identity])
///
export function Automation(duration, clock, ease = identity) {
	let running = false;
	let t0;
	const reset = () => t0 = clock.current;
	return {
		reset() {
			reset();
			return this;
		},
		start() {
			reset();
			running = true;
			return this;
		},
		stop() {
			running = false;
			return this;
		},
		generator: function*() {
			for (let d = 0; running && d < duration; d = clock.current - t0) {
				yield ease(d/duration);
			}
			running = false;
		},
		get isRunning() {
			return running;
		}
	};
}

/// RepeatAutomation(duration[, transform = identity])
///
export function RepeatAutomation(automation) {
	let running = false;
	return {
		reset() {
			automation.reset();
			return this;
		},
		start() {
			automation.start();
			running = true;
			return this;
		},
		stop() {
			automation.stop();
			running = false;
			return this;
		},
		completeAndStop() {
			running = false;
			return this;
		},
		generator: function*() {
			while (running) {
				yield* automation.start().generator();
			}
		},
		get isRunning() {
			return automation.isRunning;
		}
	}
}

/// CompositeAutomation(duration[, transform = identity])
///
export function SequenceAutomation(...automations) {
	let running = false;
	let current = 0;
	const reset = () => {
		for (let automation of automations) {
			automation.stop();
		}
		current = 0;
	};
	return {
		reset() {
			reset();
			return this;
		},
		start() {
			reset();
			running = true;
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
		generator: function*() {
			for (;running && current < automations.length; ++current) {
				const automation = automations[current];
				automation.start();
				for (let value of automation.generator()) {
					yield value;
				}
			}
			running = false;
		},
		get isRunning() {
			return running || automations.some(a => a.isRunning);
		}
	}
}

export function CompositeAutomation(automations) {
	const generators = Object.entries(automations).reduce(
		(res, [prop, automation]) => Object.assign(res, {
			[prop]: automation.generator()
	}), {});
	const is_running = () => {
		return Object.values(automations).every(automation => {
			return automation.isRunning;
		});
	};
	return {
		reset() {
			Object.values(automations).forEach(a => a.reset());
			return this;
		},
		start() {
			Object.values(automations).forEach(a => {
				a.start();
			});
			return this;
		},
		stop() {
			Object.values(automations).forEach(a => a.stop());
			return this;
		},
		generator: function*() {
			while (is_running()) {
				yield Object.entries(generators).reduce((res, [prop, gen]) => {
					return Object.assign(res, {[prop]: gen.next().value});
				}, {});
			}
		},
		get isRunning() {
			return is_running();
		}
	};
}
