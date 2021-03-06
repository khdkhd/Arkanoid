export function completeAssign(target, ...sources) {
	sources.forEach(source => {
		let descriptors = Object.keys(source).reduce((descriptors, key) => {
			descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
			return descriptors;
		}, {});

		// Par défaut, Object.assign copie également
		// les symboles énumérables
		Object.getOwnPropertySymbols(source).forEach(sym => {
			let descriptor = Object.getOwnPropertyDescriptor(source, sym);
			if (descriptor.enumerable) {
				descriptors[sym] = descriptor;
			}
		});

		Object.defineProperties(target, descriptors);
	});

	return target;
}

export function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
