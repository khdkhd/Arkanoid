import Coordinates from 'graphics/coordinates';
import SceneObject from 'graphics/scene-object';

import {Collection, Model} from 'model';

import Rect from 'maths/rect';
import Vector from 'maths/vector';

import pick from 'lodash.pick';

const BOTTOM_OUTER_RECT = Rect(Vector.Null, {width: 2, height: 1});
const TOP_OUTER_RECT = Rect(Vector.Null, {width: 1.8, height: .8});
const INNER_RECT = Rect(Vector.Null.add({x: .2, y: .2}), {width: 1.6, height: .6});

const bricksState = {
	'gold': () => ({
		hits: Infinity,
		points: 0,
		colors: {
			inner: 'hsl(58, 65%, 43%)',
			top: 'hsl(58, 65%, 63%)'
		}
	}),
	'white': () => ({
		hits: 1,
		points: 50,
		colors: {
			inner: 'hsl(0, 0%, 95%)',
			top: 'hsl(0, 0%, 100%)'
		}
	}),
	'orange': () => ({
		hits: 1,
		points: 60,
		colors: {
			inner: 'hsl(35, 78%, 52%)',
			top: 'hsl(35, 78%, 72%)'
		}
	}),
	'cyan': () => ({
		hits: 1,
		points: 70,
		colors: {
			inner: 'hsl(181, 98%, 79%)',
			top: 'hsl(181, 98%, 99%)'
		}
	}),
	'green': () => ({
		hits: 1,
		points: 80,
		colors: {
			inner: 'hsl(93, 99%, 60%)',
			top: 'hsl(93, 99%, 80%)'
		}
	}),
	'red': () => ({
		hits: 1,
		points: 90,
		colors: {
			inner: 'hsl(7, 79%, 47%)',
			top: 'hsl(7, 79%, 67%)'
		}
	}),
	'blue': () => ({
		hits: 1,
		points: 100,
		colors: {
			inner: 'hsl(230, 96%, 64%)',
			top: 'hsl(230, 96%, 84%)'
		}
	}),
	'purple': () => ({
		hits: 1,
		points: 110,
		colors: {
			inner: 'hsl(292, 97%, 54%)',
			top: 'hsl(292, 97%, 74%)'
		}
	}),
	'yellow': () => ({
		hits: 1,
		points: 120,
		colors: {
			inner: 'hsl(61, 100%, 62%)',
			top: 'hsl(61, 100%, 82%)'
		}
	}),
	'gray': level => ({
		hits: 2 + Math.round(level/8),
		points: 50*level,
		colors: {
			inner: 'hsl(0, 0%, 62%)',
			top: 'hsl(0, 0%, 82%)'
		}
	})
};

export function BrickModel(state) {
	const model = Model({
		attributes: {
			color: state.color,
			hits: state.hits,
			position: state.position
		}
	});
	return Object.assign(model, {
		color() {
			return state.color;
		},
		hit() {
			const hits = Math.max(model.get('hits') - 1, 0);
			model.set('hits', hits);
			if (hits === 0) {
				model.destroy();
			}
			return this;
		},
		points() {
			return state.points;
		},
		serialize() {
			return pick(model.attributes(), 'color', 'position');
		}
	});
}

export function BrickView(state) {
	const coordinates = Coordinates({
		width: 2,
		height: 1
	}, Vector(state.position));
	return Object.assign(
		SceneObject(coordinates, {
			onRender(screen) {
				screen.brush = 'black';
				screen.fillRect(BOTTOM_OUTER_RECT);

				screen.brush = state.colors.top || state.colors.inner;
				screen.fillRect(TOP_OUTER_RECT);

				screen.brush = state.colors.top || state.colors.inner;
				screen.brush = state.colors.inner;
				screen.fillRect(INNER_RECT);
			}
		}),
		coordinates
	);
}

export function Brick({x, y}, color, stage) {
	const state = Object.assign({
		color,
		position: {x, y}
	}, bricksState[color](stage));
	return Object.assign(
		BrickModel(state),
		BrickView(state)
	);
}

export function BrickCollection() {
	const collection = Collection();
	collection
		.on('itemDestroyed', brick => {
			if (brick.color() !== 'gold') {
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

export default function createBricks(level, stage = 0) {
	return level.map(brick => Brick(brick.position, brick.color, stage));
}
