import {Collection} from 'model';
import {PowerUpRandomizer} from 'game/entities/power-up';

import is_nil from 'lodash.isnil';

export default function Level() {
	const maybePill = PowerUpRandomizer();
	const collection = Collection();
	collection.on('itemDestroyed', brick => {
		if (brick.color() !== 'gold') {
			const pill = maybePill(brick.position());
			if (!is_nil(pill)) {
				collection.emit('powerUp', pill);
			}
			if (collection.every(brick => brick.color() === 'gold')) {
				collection.emit('completed');
			}
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
