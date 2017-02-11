import Vector from 'maths/vector';
import Rect from 'maths/rect';
import EventEmitter from 'events';
// import _clamp from 'lodash.clamp';
import { completeAssign as assign } from 'common/utils';
// import { scale, unscale } from 'sound/common/utils';
// import ui from 'sound/controls/ui';
import Screen from 'graphics/screen';
import times from 'lodash.times';

import Coordinates from 'graphics/coordinates';
import SceneObject from 'graphics/scene-object';

function create_grid_view(state){


	const canvas = document.createElement('canvas');
	canvas.innerHTML = 'Your browser does not support canvas!';
	const screen = Screen(canvas.getContext('2d'));
	screen.width = state.width;
	screen.height =  state.height;
	state.element.appendChild(canvas);

  screen.add(SceneObject(Coordinates(state.outer_rect), {
    onRender(screen) {
      screen.clear();
      screen.save();
      screen.pen = 1;
      screen.pen = '#9a8c8c';
      screen.beginPath();
      screen.drawRect(state.outer_rect);
      screen.drawPath();
      screen.brush = '#546e6c';
      screen.pen = '#546e6c';
      screen.beginPath();
      screen.fillRect(state.inner_rect);
      screen.drawPath();
      screen.restore();
    }
  })).add(SceneObject(Coordinates(state.inner_rect), {
		onRender(screen) {
			screen.pen = '#fff';
			const cols = 16, rows = 8;
			const width =state.inner_rect.width;
			const height = state.inner_rect.height;
			const step_x = width/cols;
			const step_y = height/rows;
				screen.save();
				times(cols, () => {
					screen.translate({x: step_x, y: 0});
					screen.drawLine({x: 0, y: 0}, {x: 0, y: height});
				});
				screen.restore();
				screen.save();
				times(rows, () => {
					screen.translate({x: 0, y: step_y});
					screen.drawLine({x: 0, y: 0}, {x: width, y: 0});
				});
				screen.restore();
		},
		zIndex: 100
	}));

  return {
    render(){
      screen.render();
    }
  }

}

function create_grid_controller(state) {

	function update(value){}

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

	let width = 600, height = 400;
	const padding = 5;
	const pos = {x: 0, y: 0};
	const state = {
		element,
		pos,
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
			{
				x: pos.x + padding,
				y: pos.y + padding
			},
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
