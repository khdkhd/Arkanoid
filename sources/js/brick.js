import Vector from 'vector';
import Rect from 'rect';

function createBrick({x, y}, screen) {
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
		draw(inner_color, top_outer_color, bottom_outer_color = 'black') {
			screen.save();
			screen.scale(scale_factor);
			screen.pen = line_width;

			screen.brush = bottom_outer_color;
			screen.fillRect(bottom_outer_rect);

			screen.brush = top_outer_color;
			screen.fillRect(top_outer_rect);

			screen.brush = inner_color;
			screen.fillRect(inner_rect);

			screen.restore();
		},
		get lineWidth() {
			return line_width;
		},
		get scaleFactor() {
			return scale_factor;
		}
	};
}

export function GrayBrick({x, y}, screen) {
	const base = createBrick({x, y}, screen);
	return Object.assign({}, base, {
		draw() {
			base.draw('#777', '#ddd');
		}
	});
}

export function BlueBrick({x, y}, screen) {
	const base = createBrick({x, y}, screen);
	return Object.assign({}, base, {
		draw() {
			base.draw('hsl(226, 95%, 62%)', 'hsl(226, 95%, 82%)');
		}
	});
}

export function RedBrick({x, y}, screen) {
	const base = createBrick({x, y}, screen);
	return Object.assign({}, base, {
		draw() {
			base.draw('hsl(6, 76%, 47%)', 'hsl(6, 76%, 67%)');
		}
	});
}

export function GreenBrick({x, y}, screen) {
	const base = createBrick({x, y}, screen);
	return Object.assign({}, base, {
		draw() {
			base.draw('hsl(89, 98%, 58%)', 'hsl(89, 98%, 78%)');
		}
	});
}

export function YellowBrick({x, y}, screen) {
	const base = createBrick({x, y}, screen);
	return Object.assign({}, base, {
		draw() {
			base.draw('hsl(60, 100%, 60%)', 'hsl(60, 100%, 80%)');
		}
	});
}

export function PurpleBrick({x, y}, screen) {
	const base = createBrick({x, y}, screen);
	return Object.assign({}, base, {
		draw() {
			base.draw('hsl(290, 97%, 57%)', 'hsl(290, 97%, 77%)');
		}
	});
}
