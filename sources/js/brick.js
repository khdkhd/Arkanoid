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

export default function Brick(color, {x, y}, screen) {
	const brick_data = bricks_data[color];
	const bottom_outer_rect = Rect({x, y}, {width: 2, height: 1});
	const top_outer_rect = Rect({x, y}, {width: 1.8, height: .8});
	const inner_rect = Rect({x: x + .2, y: y + .2}, {width: 1.6, height: .6});
	const scale_factor = (screen.width/14)/2;
	const line_width = 1/scale_factor;
	return {
		get pos() {
			return Vector({x, y});
		},
		get rect() {
			return Rect(this.pos, {width: 2, height: 1});
		},
		draw() {
			screen.save();
			screen.scale(scale_factor);
			screen.pen = line_width;

			screen.brush = brick_data.colors.bottom || 'black';
			screen.fillRect(bottom_outer_rect);

			screen.brush = brick_data.colors.top || brick_data.colors.inner;
			screen.fillRect(top_outer_rect);

			screen.brush = brick_data.colors.inner;
			screen.fillRect(inner_rect);

			screen.restore();
		}
	};
}
