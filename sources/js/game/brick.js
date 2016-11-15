import Vector from 'maths/vector';
import Rect from 'maths/rect';

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

export default function Brick(color, {x, y}, scale) {
	const brick_data = bricks_data[color];
	return {
		get pos() {
			return Vector({x, y});
		},
		get bbox() {
			return Rect(this.pos, {width: 2, height: 1});
		},
		draw(screen) {
			screen.brush = brick_data.colors.bottom || 'black';
			screen.fillRect(bottom_outer_rect);

			screen.brush = brick_data.colors.top || brick_data.colors.inner;
			screen.fillRect(top_outer_rect);

			screen.brush = brick_data.colors.inner;
			screen.fillRect(inner_rect);
		}
	};
}
