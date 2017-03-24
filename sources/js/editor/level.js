import {Brick} from 'game/entities/brick';
import Vector from 'maths/vector';
import {Collection} from 'model';

import over_some from 'lodash.oversome';

const columns = 28;
const rows = 31;

function BrickPositionMatcher(position) {
	return brick => brick.position().equal(position);
}

export default function Level() {
	const collection = Collection({
		ItemModel: Brick,
		attributes: {
			size: {
				width: 224*2,
				height: 248*2
			}
		}
	});
	const match = ({x, y}) => {
		const pos = Vector({x, y});
		return over_some(
			BrickPositionMatcher(pos),
			BrickPositionMatcher(pos.add({x: -1, y: 0})),
			BrickPositionMatcher(pos.add({x:  1, y: 0}))
		);
	};
	return Object.assign(collection, {
		brickAt({x, y}) {
			return collection.find(BrickPositionMatcher({x, y}));
		},
		containsBrickAt({x, y}) {
			return collection.some(match({x, y}));
		},
		removeAt({x, y}) {
			const bricks = collection.filter(match({x, y}));
			collection.remove(bricks);
			return this;
		},
		// Size
		columns() {
			return columns;
		},
		rows() {
			return rows;
		},
		scale() {
			return Math.round(collection.get('size').width/columns);
		},
		size() {
			return collection.get('size');
		},
		setSize({width, height}) {
			return collection.set('size', {
				width,
				height
			});
		}
	});
}
