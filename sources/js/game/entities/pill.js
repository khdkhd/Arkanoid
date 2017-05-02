import {hsl} from 'graphics/color';
import SceneObject from 'graphics/scene-object';
import Rect from 'maths/rect';
import {Model, Collection} from 'model';
import VerletModel from 'physics/verlet-model';

import constant from 'lodash.constant';
import flatten from 'lodash.flatten';
import is_nil from 'lodash.isnil';
import random from 'lodash.random';
import times from 'lodash.times';

const shadow_box1 = new Path2D(`
	M ${ 4/16} ${ 2/16}
	L ${30/16} ${ 2/16}
	L ${30/16} ${16/16}
	L ${ 4/16} ${16/16}
	L ${ 4/16} ${ 2/16}
	Z
`);
const shadow_box2 = new Path2D(`
	M ${ 2/16} ${ 4/16}
	L ${32/16} ${ 4/16}
	L ${32/16} ${14/16}
	L ${ 2/16} ${14/16}
	L ${ 2/16} ${ 4/16}
	Z
`);
const outer_box1 = new Path2D(`
	M ${ 2/16} 0
	L ${28/16} 0
	L ${28/16} ${14/16}
	L ${ 2/16} ${14/16}
	L ${ 2/16} 0
	Z
`);
const outer_box2 = new Path2D(`
	M        0 ${ 2/16}
	L ${30/16} ${ 2/16}
	L ${30/16} ${12/16}
	L        0 ${12/16}
	L        0 ${ 2/16}
	Z
`);
const inner_box1 = new Path2D(`
	M ${ 2/16} ${ 6/16}
	L ${28/16} ${ 6/16}
	L ${28/16} ${10/16}
	L ${ 2/16} ${10/16}
	L ${ 2/16} ${ 6/16}
	Z
`);
const inner_box2 = new Path2D(`
	M ${ 4/16} ${ 4/16}
	L ${26/16} ${ 4/16}
	L ${26/16} ${12/16}
	L ${ 4/16} ${12/16}
	L ${ 4/16} ${ 4/16}
	Z
`);
const flare_box1 = new Path2D(`
	M ${ 2/16} ${2/16}
	L ${26/16} ${2/16}
	L ${26/16} ${4/16}
	L ${ 2/16} ${4/16}
	L ${ 2/16} ${2/16}
	Z
`);
const flare_box2 = new Path2D(`
	M       0 ${4/16}
	L ${2/16} ${4/16}
	L ${2/16} ${6/16}
	L       0 ${6/16}
	L       0 ${4/16}
	Z
`);

export function PillModel({x, y}, type) {
	const color = ({
		[Pill.Break]:     hsl(292,  84, 44), // #b612cf
		[Pill.Catch]:     hsl(120, 100, 20), // #006600
		[Pill.Expand]:    hsl(249, 100, 33), // #1c00ab
		[Pill.ExtraLife]: hsl(  0,   0, 40), // #666666
		[Pill.Laser]:     hsl(  0,  99, 39), // #c60101
		[Pill.Slow]:      hsl( 24, 100, 50), // #ff6600
		[Pill.Split]:     hsl(213,  96, 70), // #6aaafc
	})[type];
	const letter = ({
		[Pill.Break]:     'B',
		[Pill.Catch]:     'C',
		[Pill.Expand]:    'E',
		[Pill.ExtraLife]: 'P',
		[Pill.Laser]:     'L',
		[Pill.Slow]:      'S',
		[Pill.Split]:     'D'
	})[type];
	const coordinates = VerletModel({
		width: 2,
		height: 1
	}, {x, y}).setVelocity({x: 0, y: .1});
	return {
		coordinates,
		letter,
		flareColor: color.lighten(50).hex,
		innerColor: color.hex,
		outerColor: color.lighten(10).hex,
		type
	};
}

export function PillView(state) {
	const {coordinates} = state;
	const clip_rect = Rect({x: 0, y: 2/16}, {width: 30/16, height: 12/16});
	let frame = 0;
	return SceneObject(coordinates, {
		onRender(screen, scene, rect) {
			screen.brush = '#000';
			screen.fillPath(shadow_box1);
			screen.fillPath(shadow_box2);

			screen.brush = state.outerColor;
			screen.fillPath(outer_box1);
			screen.fillPath(outer_box2);

			screen.brush = state.innerColor;
			screen.fillPath(inner_box1);
			screen.fillPath(inner_box2);

			screen.brush = state.flareColor;
			screen.fillPath(flare_box1);
			screen.fillPath(flare_box2);

			screen.setFont({
				fontFamily: 'Press Start 2P',
				fontSize: 10,
				scale: screen.absoluteScale().x
			});
			screen.setTextBaseline('top');
			screen.clipRect(clip_rect);

			const text_pos = {x: .6 + 2/16, y: frame/10 - .8 + 2/16};

			screen.save();
			screen.translate(text_pos);
			screen.brush = '#000';
			screen.fillText({
				text: state.letter,
				rect
			});
			screen.restore();

			text_pos.x -= 2/16;
			text_pos.y -= 2/16;

			screen.save();
			screen.translate(text_pos);
			screen.brush = 'yellow';
			screen.fillText({
				text: state.letter,
				rect
			});
			screen.restore();

			frame = (frame + .25)%14;
		}
	});
}

export function PillController(state) {
	return {
		type() {
			return state.type;
		},
		letter() {
			return state.letter;
		}
	}
}

export default function Pill({x, y}, type) {
	const state = PillModel({x, y}, type);
	return Object.assign(
		Model(),
		state.coordinates,
		PillView(state),
		PillController(state)
	);
}

Object.defineProperty(Pill, 'Break', {
	writable: false,
	value: Symbol('Pill.Break')
});

Object.defineProperty(Pill, 'Catch', {
	writable: false,
	value: Symbol('Pill.Catch')
});

Object.defineProperty(Pill, 'Expand', {
	writable: false,
	value: Symbol('Pill.Expand')
});

Object.defineProperty(Pill, 'ExtraLife', {
	writable: false,
	value: Symbol('Pill.ExtraLife')
});

Object.defineProperty(Pill, 'Laser', {
	writable: false,
	value: Symbol('Pill.Laser')
});

Object.defineProperty(Pill, 'Slow', {
	writable: false,
	value: Symbol('Pill.Slow')
});

Object.defineProperty(Pill, 'Split', {
	writable: false,
	value: Symbol('Pill.Split')
});

export const PillDistribution = [
	[null,          24], [Pill.Catch,     2], [Pill.Expand,    2],
	[Pill.Laser,     2], [Pill.Slow,      2], [Pill.Split,     2],
	[Pill.Break,     1], [Pill.ExtraLife, 1]
];

export function PillCollection(distribution = PillDistribution) {
	const pillsDistribution = flatten(distribution.map(([item, count]) => times(count, constant(item))));
	const collection = Collection({ItemModel: Pill});
	return Object.assign(collection, {
		random({x, y}) {
			const type = pillsDistribution[random(pillsDistribution.length - 1)];
			if (!is_nil(type)) {
				collection.create({x, y}, type);
			}
		}
	});
}
