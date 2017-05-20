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

export const [UP, DOWN] = [1, -1];

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
      screen.clear();
			screen.save();
			screen.pen = 1;
      screen.brush = '#77ab63';
			screen
        .beginPath()
        .moveTo(UP === state.direction ? rect.bottomLeft : rect.topLeft)
        .lineTo(UP === state.direction ? rect.bottomRight : rect.topRight)
        .lineTo({x: rect.width/2, y: UP === state.direction ? 0 : state.height})
        .closePath()
        .fillPath();
      screen.restore();
		},
		zIndex: 4
	});

	const view = GraphicsView({
		domEvents: MouseEventsHandler(state.mouseEvents),
		onBeforeRender(screen){
			screen.setSize({
				width: state.width,
				height: state.height
			})
		}
	});
	view.screen().add(scene.add(spinbox));
  Object.assign(view,
    {
      setDirection(direction){
        state.direction = direction
        return view
      },
      UP,
      DOWN
    }
  );
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
      state.param = audio_param;
    },
    get param(){
      return state.param;
    }
  };

}

export default function Spinbox({width, height}, mouseEvents = {}) {
  const state = {
    width,
    height,
    direction: UP,
    mouseEvents,
    emitter: new EventEmitter()
  };
  return assign(state.emitter, View(state), Controller(state));
}
