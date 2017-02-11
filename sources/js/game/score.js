import {EventEmitter} from 'events';

export default () => {
	let points = 0;
	const emitter = new EventEmitter();
	return Object.assign(emitter, {
		gain(point) {
			points += point;
			emitter.emit('changed');
			return this;
		},
		points() {
			return points;
		}
	});
}
