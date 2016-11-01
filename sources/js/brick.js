import Rect from 'rect';

export default function createBrick({x, y}, screen) {
	const rect = Rect({x, y}, {width: 2, height: 1});
	const scale_factor = (screen.width/14)/2;

	return {
		get pos() {
			return rect.topLeft;
		},
		draw() {
			screen.save();
			screen.scale(scale_factor);

			screen.pen = {
				lineWidth: 1/scale_factor,
				strokeStyle: '#222'
			};
			screen.brush = this.color || 'red';

			screen.fillRect(rect);
			screen.drawRect(rect);
			screen.restore();
		}
	};
}

export function GrayBrick({x, y}, screen) {
	const base = createBrick({x, y}, screen);
	return Object.assign({
		get color() {
			return '#444';
		},
		draw() {
			base.draw();
		}
	}, base);
}

export function BlueBrick({x, y}, screen) {
	const base = createBrick({x, y}, screen);
	return Object.assign({
		get color() {
			return 'blue';
		},
		draw() {
			base.draw();
		}
	}, base);
}
