import {completeAssign} from 'common/utils';
import Vector from 'maths/vector';
import Rect from 'maths/rect';
import VerletModel from 'physics/verlet-model';
import SceneObject from 'graphics/scene-object';
import {EventEmitter} from 'events';

import is_nil from 'lodash.isnil';

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

function gray_brush(screen) {
	return {fillStyle: screen.createLinearGradient(Vector.Null, Vector.Down, [
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
	])};
}

function red_brush(screen) {
	return {fillStyle: screen.createLinearGradient(Vector.Null, Vector.Down, [
		{pos:  0, color: '#9c2d08'},
		{pos: .1, color: '#9c2d08'},
		{pos: .2, color: '#eec0a0'},
		{pos: .3, color: '#eec0a0'},
		{pos: .4, color: '#dd5e03'},
		{pos: .6, color: '#dd5e03'},
		{pos: .7, color: '#dd5e03'},
		{pos: .8, color: '#8e2901'},
		{pos:  1, color: '#8e2901'}
	])};
}

function blue_brush(screen) {
	return {fillStyle: screen.createLinearGradient(Vector.Null, Vector.Down, [
		{pos:  0, color: '#13f0fa'},
		{pos: .4, color: '#a2f7fb'},
		{pos:  1, color: '#13f0fa'}
	])};
}

export function VausModel({x, y}) {
	return {
		emitter: new EventEmitter(),
		padSize: 1,
		lifes: 3,
		verlet: VerletModel({
			width: 3,
			height: 1
		}, {x, y})
	};
}

export function VausView(state) {
	const {verlet} = state;
	return SceneObject(verlet, {
		onRender(screen) {
			const pad_size = state.padSize;
			const brushes = {
				blue: blue_brush(screen),
				red:  red_brush (screen),
				gray: gray_brush(screen)
			};
			screen.pen = 1/screen.absoluteScale().x;

			screen.brush = brushes.blue;
			screen.fillPath(blue_box);

			screen.brush = brushes.red;
			screen.fillPath(red_box);

			screen.brush = '#222';
			screen.fillPath(margin);

			screen.brush = brushes.gray;
			screen.fillPath(gray_box);

			screen.fillRect(Rect({x: 1, y: 0}, {width: pad_size, height: 14/16}));

			screen.translate({x: 2 + pad_size, y: 0});
			screen.setScale({x: -1, y: 1});

			screen.brush = brushes.blue;
			screen.fillPath(blue_box);

			screen.brush = brushes.red;
			screen.fillPath(red_box);

			screen.brush = '#222';
			screen.fillPath(margin);

			screen.brush = brushes.gray;
			screen.fillPath(gray_box);
		},
		onSceneChanged(scene) {
			state.scene = scene;
		}
	});
}

export function VausController(state) {
	const {verlet} = state;
	let acceleration = Vector.Null;
	let moving = false;
	return {
		move(direction) {
			const scene = state.scene;
			if (!is_nil(scene)) {
				const thrust = 1/16;
				moving = !direction.isNull();
				if (moving) {
					acceleration = direction.mul(thrust);
				} else if (verlet.velocity().scalar(acceleration) > 0) {
					acceleration = acceleration.opposite;
				}
			}
			return this;
		},
		update() {
			const scene = state.scene;
			if (!is_nil(scene)) {
				const velocity = verlet.velocity().add(acceleration);
				const scalar = velocity.scalar(acceleration);
				const speed = Math.abs(velocity.x); // equivalent to velocity.norm
				const thrust = 1/16;
				const max_speed = 8/16;

				if (!moving && speed <= thrust) {
					verlet.setVelocity(Vector.Null);
				} else if (moving && scalar >= 0 && Math.abs(speed - max_speed) <= thrust) {
					verlet.setVelocity(Vector({x: Math.sign(acceleration.x)*max_speed, y: 0}));
				} else {
					verlet.setVelocity(velocity);
				}
				verlet.update();
			}
			return this;
		},
		padSize() {
			return state.padSize;
		},
		setPadSize(pad_size) {
			state.padSize = Math.round(pad_size);
			state.verlet.setSize({
				width: 2 + pad_size,
				height: 1
			});
			return this;
		},
		reset({x, y}) {
			verlet
				.setVelocity(Vector.Null)
				.setPosition(Vector({x, y}));
			return this;
		},
	};
}

export function Vaus({x, y}) {
	const state = VausModel({x, y});
	return completeAssign(
		state.emitter,
		state.verlet,
		VausView(state),
		VausController(state)
	);
}

export default Vaus;
