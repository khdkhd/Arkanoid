import {Collection} from 'model';

export default function Level() {
	const collection = Collection();
	collection.on('model-destroyed', () => {
		if (collection.every(brick => brick.color() === 'gold')) {
			collection.emit('completed');
		}
	});
	return Object.assign(collection, {
		neighborhood(position) {
			const col = Math.round(position.x);
			const row = Math.round(position.y);
			return collection.filter(brick => {
				const brick_pos = brick.position();
				return Math.abs(col - brick_pos.x) <= 2
					&& Math.abs(row - brick_pos.y) <= 1;
			});
		}
	});
}
