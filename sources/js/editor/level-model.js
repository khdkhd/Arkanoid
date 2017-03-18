import Vector from 'maths/vector';
import {Model} from 'model';

import is_array from 'lodash.isarray';
import over_some from 'lodash.oversome';
import remove from 'lodash.remove';
import without from 'lodash.without';

function BrickPositionMatcher(position) {
	return brick => brick.position().equal(position);
}

export default function LevelModel() {
	const model = Model({attributes: {bricks: []}});
	const match = ({x, y}) => {
		const pos = Vector({x, y});
		return over_some(
			BrickPositionMatcher(pos),
			BrickPositionMatcher(pos.add({x: -1, y: 0})),
			BrickPositionMatcher(pos.add({x:  1, y: 0}))
		);
	};
	return Object.assign(model, {
		add(bricks) {
			model.set('bricks', model.get('bricks').concat(bricks));
			return this;
		},
		brickAt({x, y}) {
			return model.get('bricks').find(BrickPositionMatcher({x, y}));
		},
		containsBrickAt({x, y}) {
			return model.get('bricks').some(match({x, y}));
		},
		remove(bricks) {
			bricks = is_array(bricks) ? bricks : [bricks];
			if (bricks.length > 0) {
				model.set('bricks', without(model.get('bricks'), ...bricks));
			}
			return this;
		},
		removeAt({x, y}) {
			const bricks = model.get('bricks');
			remove(bricks, match({x, y}));
			model.set('bricks', bricks);
			return this;
		},
		reset(bricks) {
			model.set('bricks', bricks);
			return this;
		},
		[Symbol.iterator]: function() {
			return model.get('bricks')[Symbol.iterator]();
		}
	});
}
