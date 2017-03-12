import Vector from 'maths/vector';
import Rect from 'maths/rect';
import EventEmitter from 'events';
import _clamp from 'lodash.clamp';
import { completeAssign as assign } from 'common/utils';
import { scale, unscale } from 'sound/common/utils';
import ui from 'sound/controls/ui';
import Screen from 'graphics/screen';
import times from 'lodash.times';
import keyboard from 'ui/keyboard';


function view(state) {
  return  {
    render(screen){

    }
  }
}

function controller(state) {

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

export default ({element}) => {
  const state = {
		element,
    emitter: new EventEmitter()
  };
  return assign(state.emitter, view(state), controller(state));
}
