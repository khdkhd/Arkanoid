import Vector from 'maths/vector';
import Rect from 'maths/rect';
import EventEmitter from 'events';
// import _clamp from 'lodash.clamp';
import { completeAssign as assign } from 'common/utils';
// import { scale, unscale } from 'sound/common/utils';

import Screen from 'graphics/screen';
import times from 'lodash.times';

import Coordinates from 'graphics/coordinates';
import SceneObject from 'graphics/scene-object';
import Scene from 'graphics/scene';


function create_grid_view(state){


	const canvas = document.createElement('canvas');
	canvas.innerHTML = 'Your browser does not support canvas!';
	const screen = Screen(canvas.getContext('2d'));
	screen.width = state.width;
	screen.height =  state.height;
	state.element.appendChild(canvas);

	const scene = Scene(Coordinates(screen.localRect()));

	const background = SceneObject(Coordinates(state.outer_rect), {
		onRender(screen) {
			screen.save();
			screen.pen = 1;
			screen.pen = '#9a8c8c';
			screen.brush = '#9a8c8c';
			screen.fillRect(state.outer_rect);
			screen.brush = '#546e6c';
			screen.pen = '#546e6c';
			screen.fillRect(state.inner_rect);
			screen.restore();
		},
		zIndex: 0
	});
	const grid = SceneObject(Coordinates(state.inner_rect), {
		onRender(screen) {
			screen.pen = '#fff';
			const cols = state.divisors, rows = 16;
			const width = state.inner_rect.width;
			const height = state.inner_rect.height;
			const step_x = width/cols;
			const step_y = height/rows;
			screen.save();
			screen.translate(state.inner_rect.topLeft);
			times(cols, () => {
				screen.translate({x: step_x, y: 0});
				screen.drawLine({x: 0, y: 0}, {x: 0, y: height});
			});
			screen.restore();
			screen.save();
			screen.translate(state.inner_rect.topLeft);
			times(rows, () => {
				screen.translate({x: 0, y: step_y});
				screen.drawLine({x: 0, y: 0}, {x: width, y: 0});
			});
			screen.restore();
		},
		zIndex: 1
	});
	const cursor = SceneObject(Coordinates(state.inner_rect), {
		onRender(screen) {
			screen.pen = '#fff';
			screen.brush = 'hsla(356, 63%, 51%, 0.5)';
			const cols = state.divisors;
			const width = state.inner_rect.width/cols;
			const height = state.inner_rect.height;
			screen.save();
			screen.fillRect(Rect(state.cursor_pos,{
					width,
					height
			}));
			screen.restore();
		},
		zIndex: 3
	});

	screen.add(scene.add(background).add(grid).add(cursor));


  return {
    render(){
			screen.clear();
			screen.render();
    }
  }

}

function create_grid_controller(state) {

	function update(){
		const cols = state.divisors;
		const width = state.inner_rect.width;
		let step_x = width/cols;
		if(state.cursor_pos.x + step_x >= width + 5){
			step_x = -width;
		}
		state.cursor_pos = state.cursor_pos.add({
			x: step_x,
			y: 0
		});

	}

	state.emitter.on('change', value => state.param.value = value);

	return {
		set param(audio_param){
			state.param = audio_param;
			state.param.on('change', value => {
				if(!state.isActive){
					update(value);
				}
			});
			update(audio_param.value);
		},
		get param(){
			return state.param;
		}
	};
}

export default ({element})=> {

	let width = 1200, height = 800;
	const padding = 5;
	const pos = Vector({x: 0, y: 0});
	const cursor_pos = pos.add(Vector({x:padding,y: padding}));
	const divisors = 16;
	const state = {
		element,
		pos,
		divisors,
		cursor_pos,
		padding,
		width,
		height,
		outer_rect: Rect(
			pos,
			{
				width,
				height
			}
		),
		inner_rect : Rect(
			pos.add({
				x: padding,
				y: padding
			}),
			{
				width: width - padding*2,
				height: height - padding*2
			}
		),
		param: {
			value: 0,
			on: () => {}
		},
		emitter: new EventEmitter()
	};
	return assign(state.emitter, create_grid_controller(state), create_grid_view(state));
}
