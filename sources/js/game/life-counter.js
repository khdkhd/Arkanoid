import {EventEmitter} from 'events';

export default count => {
	const emitter = new EventEmitter();
	return Object.assign(emitter, {
		gain() {
			count += 1;
			emitter.emit('changed');
			return this;
		},
		take() {
			if (count > 0) {
				count -= 1;
				emitter.emit('changed');
			}
		},
		count() {
			return count;
		}
	});
}
