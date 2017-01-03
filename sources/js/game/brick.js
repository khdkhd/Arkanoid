import {completeAssign} from 'common/utils';
import BoundingBox from 'graphics/bounding-box';
import Rect from 'maths/rect';
import Vector from 'maths/vector';
import VerletModel from 'physics/verlet-model';
import SceneObject from 'graphics/scene-object';

import {EventEmitter} from 'events';

import is_nil from 'lodash.isnil';

const BOTTOM_OUTER_RECT = Rect(Vector.Null, {width: 2, height: 1});
const TOP_OUTER_RECT = Rect(Vector.Null, {width: 1.8, height: .8});
const INNER_RECT = Rect(Vector.Null.add({x: .2, y: .2}), {width: 1.6, height: .6});

const bricks_state = {
	'gold': () => ({
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
		point: 120,
		colors: {
			inner: 'hsl(61, 100%, 62%)',
			top: 'hsl(61, 100%, 82%)'
		}
	}),
	'gray': (level) => ({
		hits: 2 + Math.round(level/8),
		points: 50*level,
		colors: {
			inner: 'hsl(0, 0%, 62%)',
			top: 'hsl(0, 0%, 82%)'
		}
	})
};

function BrickBoundingBox(state) {
	return BoundingBox(completeAssign(
		{},
		state.verlet,
		{size: state.size}
	));
}

function BrickController(state) {
	return {
		hit() {
			if (!(is_nil(state.hits) || state.destroyed)) {
				state.hits = state.hits - 1;
				state.emitter.emit('hit', state.points);
				if (state.hits === 0) {
					state.destroyed = true;
					state.emitter.emit('destroyed');
				}
			}
		},
		update() {
		},
		get color() {
			return state.color;
		},
		get destroyed() {
			return state.destroyed;
		},
		get points() {
			return state.points;
		}
	};
}

function BrickView(state) {
	return SceneObject({
		emitter: state.emitter,
		onRender(screen) {
			screen.translate(state.verlet.position);

			screen.brush = 'black';
			screen.fillRect(BOTTOM_OUTER_RECT);

			screen.brush = state.colors.top || state.colors.inner;
			screen.fillRect(TOP_OUTER_RECT);

			screen.brush = state.colors.top || state.colors.inner;
			screen.brush = state.colors.inner;
			screen.fillRect(INNER_RECT);
		}
	});
}

export default function Brick({x, y}, color, level) {
	const state = completeAssign(
		bricks_state[color](level),
		{
			color,
			destroyed: false,
			emitter: new EventEmitter(),
			size: {width: 2, height: 1},
			verlet: VerletModel(Vector({x, y})),
		}
	);

	return completeAssign(
		state.emitter,
		state.verlet,
		BrickBoundingBox(state),
		BrickController(state),
		BrickView(state)
	);
}
