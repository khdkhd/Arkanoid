import {EventEmitter} from 'events';
import {hsl} from 'graphics/color';
import SceneObject from 'graphics/scene-object';

import Rect from 'maths/rect';

import VerletModel from 'physics/verlet-model';

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

export function PowerUpModel({x, y}, type) {
	const color = ({
		[PowerUp.Laser]:     hsl(  0,  99, 39), // #c60101
		[PowerUp.Slow]:      hsl( 24, 100, 50), // #ff6600
		[PowerUp.ExtraLife]: hsl(  0,   0, 40), // #666666
		[PowerUp.Expand]:    hsl(187, 100, 36), // #00a2b8
		[PowerUp.Catch]:     hsl(120, 100, 20)  // #006600
	})[type];
	const letter = ({
		[PowerUp.Laser]:     'L',
		[PowerUp.Slow]:      'S',
		[PowerUp.ExtraLife]: 'P',
		[PowerUp.Expand]:    'E',
		[PowerUp.Catch]:     'C'
	})[type];
	return {
		emitter: new EventEmitter(),
		coordinates: VerletModel({
			width: 2,
			height: 1
		}, {x, y}),
		letter,
		flareColor: color.lighten(50).hex,
		innerColor: color.hex,
		outerColor: color.lighten(10).hex,
		type
	};
}

export function PowerUpView(state) {
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

			screen.brush = 'yellow';
			screen.setFont({
				fontFamily: 'Press Start 2P',
				fontSize: 10,
				scale: screen.absoluteScale().x
			});
			screen.setTextBaseline('top');
			screen.clipRect(clip_rect);
			screen.translate({x: .6, y: frame/10 - .8});
			screen.fillText({
				text: state.letter,
				rect
			});
			frame = (frame + .25)%14;
		}
	});
}

export default function PowerUp({x, y}, type) {
	const state = PowerUpModel({x, y}, type);
	return Object.assign(
		state.emitter,
		state.coordinates,
		PowerUpView(state)
	);
}

Object.defineProperty(PowerUp, 'Laser', {
	writable: false,
	value: Symbol('PowerUp.Laser')
});

Object.defineProperty(PowerUp, 'Slow', {
	writable: false,
	value: Symbol('PowerUp.Slow')
});

Object.defineProperty(PowerUp, 'ExtraLife', {
	writable: false,
	value: Symbol('PowerUp.ExtraLife')
});

Object.defineProperty(PowerUp, 'Expand', {
	writable: false,
	value: Symbol('PowerUp.Expand')
});

Object.defineProperty(PowerUp, 'Catch', {
	writable: false,
	value: Symbol('PowerUp.Catch')
});
