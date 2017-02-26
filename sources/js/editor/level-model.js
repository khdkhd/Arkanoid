import Vector from 'maths/vector';

import {EventEmitter} from 'events';

import is_array from 'lodash.isarray';
import over_some from 'lodash.oversome';
import pull from 'lodash.pull';
import remove from 'lodash.remove';

function BrickPositionMatcher(position) {
	return brick => brick.position().equal(position);
}

export default () => {
	const emitter = new EventEmitter();
	let bricks = [];
	const match = ({x, y}) => {
		const pos = Vector({x, y});
		return over_some(
			BrickPositionMatcher(pos),
			BrickPositionMatcher(pos.add({x: -1, y: 0})),
			BrickPositionMatcher(pos.add({x:  1, y: 0}))
		);
	};
	return Object.assign(emitter, {
		add(some_bricks) {
			for (let brick of is_array(some_bricks) ? some_bricks : [some_bricks]) {
				bricks.push(brick);
			}
			emitter.emit('changed');
			return this;
		},
		brickAt({x, y}) {
			return bricks.find(BrickPositionMatcher({x, y}));
		},
		containsBrickAt({x, y}) {
			return bricks.some(match({x, y}));
		},
		remove(some_bricks) {
			for (let brick of is_array(some_bricks) ? some_bricks : [some_bricks]) {
				pull(bricks, brick);
			}
			emitter.emit('changed');
			return this;
		},
		removeAt({x, y}) {
			remove(bricks, match({x, y}));
			emitter.emit('changed');
			return this;
		},
		reset(some_bricks) {
			bricks = some_bricks;
			emitter.emit('changed');
			return this;
		},
		toJSON() {
			return JSON.stringify(bricks.map(brick => {
				const {x, y} = brick.position();
				return {
					color: brick.color,
					position: {x, y}
				};
			}));
		},
		[Symbol.iterator]: function() {
			return bricks[Symbol.iterator]();
		}
	});
}
