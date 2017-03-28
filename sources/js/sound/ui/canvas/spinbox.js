import EventEmitter from 'events';
import { completeAssign as assign } from 'common/utils';
import ui from 'sound/controls/ui';
import times from 'lodash.times';
import keyboard from 'ui/keyboard';
import { default as GraphicsView, MouseEventsHandler } from 'ui/graphics-view';
import Coordinates from 'graphics/coordinates';
import Rect from 'maths/rect';
import SceneObject from 'graphics/scene-object';

import Scene from 'graphics/scene';

function View(state){

  const rect = Rect({
		x: 0,
		y: 0
	},{
		width: state.width,
		height: state.height
	});

	const coordinates = Coordinates(rect);
	const scene = Scene(coordinates);
	const spinbox = SceneObject(coordinates, {
		onRender(screen) {
      // screen.setBackgroundColor('rgba(255, 255, 255, 0)');
      screen.clear();
			screen.save();
			screen.pen = 1;
      screen.pen = '#000';
      screen.brush = '#000';
			screen
        .beginPath()
        .moveTo(rect.bottomLeft)
        .lineTo(rect.bottomRight)
        .lineTo({x: rect.width/2, y: 0})
        .closePath()
        .fillPath();
			// screen.drawLine(rect.bottomRight, {x: rect.width/2, y: 5});
			// screen.drawLine(rect.bottomLeft,{x: rect.width/2, y: 5});
      screen.restore();
		},
		zIndex: 4
	});

	const view = GraphicsView({
		domEvents: MouseEventsHandler({
			onMouseUp(){

			}
		}),
		onBeforeRender(screen){
			screen.setSize({
				width: state.width,
				height: state.height
			})
		}
	});
	view.screen().add(scene.add(spinbox));
	return view;
}


function Controller(state) {

  function update(value){
    console.log('update',value)
  }

  state.emitter.on('change', value => state.param.value = value);


  return {
    set param(audio_param){
      audio_param.on('change', value => {
        if(!state.isActive){
            update(value);
        }
      });
      times(10, i => {
        ui.bind_events({
          keypress: {
            code: keyboard['KEY_' + i],
            event: 'change',
            keyup(){
              audio_param.value = i            },
            keydown(){}
          }
        });
      });
      state.param = audio_param;
    },
    get param(){
      return state.param;
    }
  };

}

export default function Spinbox({width, height}) {
  const state = {
    width,
    height,
    emitter: new EventEmitter()
  };
  return assign(state.emitter, View(state), Controller(state));
}
