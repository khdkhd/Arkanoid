import {Animation} from 'animation';
import Vector from 'vector';
import Rect from 'rect';
import Entity from 'entity';
import {EventEmitter} from 'events';
import is_nil from 'lodash.isnil';

const bricks_data = {
	'gold': () => ({
		points: 0,
		colors: {
			inner: 'hsl(58, 65%, 43%)',
			top: 'hsl(58, 65%, 63%)',
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

const bottom_outer_rect = Rect(Vector.Null, {width: 2, height: 1});
const top_outer_rect = Rect(Vector.Null, {width: 1.8, height: .8});
const inner_rect = Rect(Vector.Null.add({x: .2, y: .2}), {width: 1.6, height: .6});

const hit_animation_frame_count = 30;

function auto_increment_id(current) {
	return () => current++;
}

const next_id = auto_increment_id(0);

export default function Brick(color, {x, y}, level) {
	const emitter = new EventEmitter();
	const entity = Entity(null, {x, y}, {width: 2, height: 1});

	const state = Object.assign({id: next_id()}, bricks_data[color](level));
	const destroyed = () => {
		return !is_nil(state.hits) && state.hits === 0;
	};

	const bottom_outer_rect_color = Animation(
		hit_animation_frame_count,
		v => {
			const lightness = Math.round(50*v)
			return `hsl(0, 100%, ${lightness}%)`;
		}
	);

	return Object.assign(emitter, entity, {
		hit() {
			if (!destroyed()) {
				state.hits = state.hits - 1;
				emitter.emit('hit', state.id, state.points);
				if (destroyed()) {
					// stat destroyed animation
					emitter.emit('destroyed', state.id);
				} else {
					// start hitten animation
					bottom_outer_rect_color.start();
				}
			}
		},
		get destroyed() {
			return destroyed();
		},
		get id() {
			return state.id;
		},
		get points() {
			return state.points;
		},
		draw(screen) {
			screen.brush = bottom_outer_rect_color.next();
			screen.fillRect(bottom_outer_rect);

			screen.brush = state.colors.top || state.colors.inner;
			screen.fillRect(top_outer_rect);

			screen.brush = state.colors.inner;
			screen.fillRect(inner_rect);
		}
	});
}
