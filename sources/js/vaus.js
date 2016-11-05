import Rect from 'rect';
import Vector from 'vector';

const blue_box = new Path2D(`
	M ${0/16} ${ 6/16}
	L ${1/16} ${ 6/16}
	L ${1/16} ${ 5/16}
	L ${2/16} ${ 5/16}
	L ${2/16} ${11/16}
	L ${1/16} ${11/16}
	L ${1/16} ${10/16}
	L ${0/16} ${10/16}
	L ${0/16} ${ 6/16}
`);
const red_box = new Path2D(`
	M ${ 2/16} ${ 3/16}
	L ${ 3/16} ${ 3/16}
	L ${ 3/16} ${ 2/16}
	L ${ 4/16} ${ 2/16}
	L ${ 4/16} ${ 1/16}
	L ${ 5/16} ${ 1/16}
	L ${ 5/16} ${ 0/16}
	L ${10/16} ${ 0/16}
	L ${10/16} ${16/16}
	L ${ 5/16} ${16/16}
	L ${ 5/16} ${15/16}
	L ${ 4/16} ${15/16}
	L ${ 4/16} ${14/16}
	L ${ 3/16} ${14/16}
	L ${ 3/16} ${13/16}
	L ${ 2/16} ${13/16}
	L ${ 2/16} ${ 3/16}
`);
const margin = new Path2D(`
	M ${10/16} ${1/16}
	L ${12/16} ${1/16}
	L ${12/16} ${14/16}
	L ${10/16} ${14/16}
	L ${10/16} ${1/16}
`);
const gray_box = new Path2D(`
	M ${12/16} ${0/16}
	L ${16/16 + .5/16} ${0/16}
	L ${16/16 + .5/16} ${14/16}
	L ${12/16} ${14/16}
	L ${12/16} ${0/16}
`);
const segment_box = new Path2D(`
	M ${ 0/16 + .5/16} ${ 0/16}
	L ${16/16 + .5/16} ${ 0/16}
	L ${16/16 + .5/16} ${14/16}
	L ${ 0/16 + .5/16} ${14/16}
	L ${ 0/16 + .5/16} ${ 0/16}
`);

export default function createVaus({x, y}, scale) {
	let pos = Vector({x, y});
	let segments = 1;

	return {
		move(v) {
			let {x, y} = pos.add(v).mul(scale);
			pos = Vector({x: (x | 0) + .5, y}).mul(1/scale);
		},
		draw(screen) {
			const gray_fill = screen.createLinearGradient(0, 0, 0, 1, [
				{pos:  0, color: '#6f6f6d'},
				{pos: .1, color: '#6f6f6d'},
				{pos: .2, color: '#d6d6d6'},
				{pos: .3, color: '#d6d6d6'},
				{pos: .4, color: '#8f8f8f'},
				{pos: .5, color: '#8f8f8f'},
				{pos: .6, color: '#696969'},
				{pos: .7, color: '#696969'},
				{pos: .8, color: '#3b3b3b'},
				{pos:  1, color: '#3b3b3b'}
			]);
			const red_fill = screen.createLinearGradient(0, 0, 0, 1, [
				{pos:  0, color: '#9c2d08'},
				{pos: .1, color: '#9c2d08'},

				{pos: .2, color: '#eec0a0'},
				{pos: .3, color: '#eec0a0'},

				{pos: .4, color: '#dd5e03'},
				{pos: .6, color: '#dd5e03'},
				{pos: .7, color: '#dd5e03'},

				{pos: .8, color: '#8e2901'},
				{pos:  1, color: '#8e2901'}
			]);
			const blue_fill = screen.createLinearGradient(0, 0, 0, 1, [
				{pos:  0, color: '#13f0fa'},
				{pos: .4, color: '#a2f7fb'},
				{pos:  1, color: '#13f0fa'}
			]);

			screen.save();
				screen.pen = 1/scale;

				screen.brush = {fillStyle: blue_fill};
				screen.fillPath(blue_box);

				screen.brush = {fillStyle: red_fill};
				screen.fillPath(red_box);

				screen.brush = '#222';
				screen.fillPath(margin);

				screen.brush = {fillStyle: gray_fill};
				screen.fillPath(gray_box);

				for (let i = 0; i < segments; ++i) {
					screen.translate({x: 1, y: 0});
					screen.fillPath(segment_box);
				}

				screen.translate({x: 2, y: 0});
				screen.scale({x: -1, y: 1});

				screen.brush = {fillStyle: blue_fill};
				screen.fillPath(blue_box);

				screen.brush = {fillStyle: red_fill};
				screen.fillPath(red_box);

				screen.brush = '#222';
				screen.fillPath(margin);

				screen.brush = {fillStyle: gray_fill};
				screen.fillPath(gray_box);

			screen.restore();
		},
		get bbox() {
			return Rect(pos, {width: 2 + segments, height: 1});
		},
		get pos() {
			return pos;
		}
	};
}
