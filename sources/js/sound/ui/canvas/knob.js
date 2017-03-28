import Rect from 'maths/rect';
import EventEmitter from 'events';
import clamp from 'lodash.clamp';
import { completeAssign as assign } from 'common/utils';

import Coordinates from 'graphics/coordinates';
import SceneObject from 'graphics/scene-object';
import Scene from 'graphics/scene';
import { default as GraphicsView, MouseEventsHandler } from 'ui/graphics-view';

export function get_angle_increment(event, state){
  return Math.sign(-event.deltaY)*(state.curve_length/state.inc_factor);
}

export  function tweak(event, state) {
  const angle = state.angle + get_angle_increment(event, state);
  state.angle = clamp(angle, state.curve_start, state.curve_end);
  state.emitter.emit('change', (state.angle + Math.PI/2)/state.curve_length);
}

const View = state => {

  const coordinates = Coordinates(state.rect);
  const scene = Scene(coordinates);

  const knob = SceneObject(coordinates, {
    onRender(screen) {
      screen.save();
      screen.pen =.5;
      screen.pen = '#333333';
      screen.beginPath();
      screen.arc(state.pos, state.outer_radius, 0, 2*Math.PI);
      screen.drawPath();
      screen.beginPath();
      screen.arc(state.pos, state.inner_radius, 0, 2*Math.PI);
      screen.drawPath();
      screen.pen = state.cursor_width;
      screen.pen = '#cbc5cb';
      screen.beginPath();
      screen.arc(state.pos, state.cursor_radius, state.curve_start, state.curve_end);
      screen.drawPath();
      screen.restore();
      screen.save();
      screen.pen = 'rgb(67, 86, 117)';
      screen.pen = state.cursor_width;
      screen.beginPath();
      screen.arc(state.pos, state.cursor_radius, state.curve_start, state.angle);
      screen.drawPath();
      screen.restore();
    }
  });

  const view = GraphicsView({
    domEvents : MouseEventsHandler({
      onMouseWheel(view, event){
        state.isActive = true;
        tweak(event, state);
      }
    }),
    onBeforeRender(screen){
      screen.setBackgroundColor('#fff');
      screen.setSize({
        width: state.rect.width,
        height: state.rect.height
      })
    }
  });

  view.screen().add(scene.add(knob));
  return view;
}

const Controller = state => {

	function update(value){
		state.angle = state.curve_length*value - Math.PI/2;
	}

	state.emitter.on('change', value => state.param.value = value);

	return {
		set param(audio_param){
			audio_param.on('change', value => {
				if(!state.isActive){
					update(value);
				}
			});
			update(audio_param.value);
			state.param = audio_param;
		},
		get param(){
			return state.param;
		}
	};
}

export default ({width, height})=> {
  const padding = 5;
	let radius = width/2 - padding;
	let pos = {
		x: radius + padding,
		y: radius + padding
	};
	const offset = 0;
	const curve_start = -Math.PI/2 + offset;
	const curve_end = 2*Math.PI - Math.PI/2 - offset;
	const curve_length = curve_end - curve_start;
	const inc_factor = 25;
	const state = {
		pos,
		padding,
		curve_start,
		curve_end,
		curve_length,
		inc_factor,
		outer_radius: radius,
		inner_radius: radius - radius*.64,
		cursor_radius: radius - radius*.32,
		cursor_width: radius*.4,
		angle: curve_start,
		isActive: false,
    rect : Rect(
			{
        x:0,
        y:0
      },
			{
				width,
				height
			}
		),
		param: {
			value: 0,
			on: () => {}
		},
		emitter: new EventEmitter()
	};
	return assign(state.emitter, View(state), Controller(state));
}
