import Vector from 'vector';
import Rect from 'rect';

const bricks_data = {
	'white': {
		colors: {
			inner: 'hsl(0, 0%, 95%)',
			top: 'hsl(0, 0%, 100%)'
		}
	},
	'orange': {
		colors: {
			inner: 'hsl(35, 78%, 52%)',
			top: 'hsl(35, 78%, 72%)'
		}
	},
	'cyan': {
		colors: {
			inner: 'hsl(181, 98%, 79%)',
			top: 'hsl(181, 98%, 99%)'
		}
	},
	'green': {
		colors: {
			inner: 'hsl(93, 99%, 60%)',
			top: 'hsl(93, 99%, 80%)'
		}
	},
	'red': {
		colors: {
			inner: 'hsl(7, 79%, 47%)',
			top: 'hsl(7, 79%, 67%)'
		}
	},
	'blue': {
		colors: {
			inner: 'hsl(230, 96%, 64%)',
			top: 'hsl(230, 96%, 84%)'
		}
	},
	'purple': {
		colors: {
			inner: 'hsl(292, 97%, 54%)',
			top: 'hsl(292, 97%, 74%)'
		}
	},
	'yellow': {
		colors: {
			inner: 'hsl(61, 100%, 62%)',
			top: 'hsl(61, 100%, 82%)'
		}
	},
	'gray': {
		colors: {
			inner: 'hsl(0, 0%, 62%)',
			top: 'hsl(0, 0%, 82%)'
		}
	},
	'gold': {
		colors: {
			inner: 'hsl(58, 65%, 43%)',
			top: 'hsl(58, 65%, 63%)'
		}
	}
};

const bottom_outer_rect = Rect(Vector.Null, {width: 2, height: 1});
const top_outer_rect = Rect(Vector.Null, {width: 1.8, height: .8});
const inner_rect = Rect(Vector.Null.add({x: .2, y: .2}), {width: 1.6, height: .6});

const hit_animation_frame_count = 30;

function square(x) {
	return x*x;
}

function normalized_quadratics_curve(upper) {
	const k = square(upper);
	return x => -2*x*(x - upper)/k;
}

function Animation(frame_count, frame_callback) {
	const state_begin_count = Math.round(frame_count/3);
	const state_end_count = state_begin_count;
	const state_frame_count = frame_count - state_begin_count - state_end_count;

	const ease_in = normalized_quadratics_curve(2*state_begin_count);
	const ease = () => 1;
	const ease_out = (x) => 1 - ease_in(x);

	let begin = state_begin_count;
	let frame = state_frame_count;
	let end = state_end_count;

	return {
		start() {
			if (end >= state_end_count) {
				begin = frame = end = 0;
			} else if (frame <= state_frame_count) {
				frame = 0;
			} else {
				begin = state_begin_count - end;
			}
		},
		next() {
			let v;
			if (begin < state_begin_count) {
				v = frame_callback(ease_in(begin));
				begin++;
			} else
			if (frame < state_frame_count) {
				v = frame_callback(ease(frame))
				frame++;
			} else
			if (end < state_end_count) {
				v = frame_callback(ease_out(end));
				end++;
			} else {
				v = frame_callback(0);
			}
			return v;
		}
	}
}

export default function Brick(color, {x, y}, scale) {
	const brick_data = bricks_data[color];
	const bottom_outer_rect_color = Animation(
		hit_animation_frame_count,
		v => {
			const lightness = Math.round(50*v)
			return `hsl(0, 100%, ${lightness}%)`;
		}
	);

	return {
		get pos() {
			return Vector({x, y});
		},
		get bbox() {
			return Rect(this.pos, {width: 2, height: 1});
		},
		hit() {
			bottom_outer_rect_color.start();
		},
		draw(screen) {
			screen.brush = bottom_outer_rect_color.next();
			screen.fillRect(bottom_outer_rect);

			screen.brush = brick_data.colors.top || brick_data.colors.inner;
			screen.fillRect(top_outer_rect);

			screen.brush = brick_data.colors.inner;
			screen.fillRect(inner_rect);
		}
	};
}
