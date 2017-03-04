import knob from 'sound/controls/knob';
import fader from 'sound/controls/fader';
import grid_manager from 'sound/controls/grid-manager';
import keyboard from 'sound/controls/keyboard';
import Screen from 'graphics/screen';
import is_nil from 'lodash.isnil';
import {create_canvas} from 'sound/common/utils';

const factory = {
  fader,
  knob,
  grid: grid_manager,
  keyboard
};


export default () => {
  return {
    get factory(){
      return factory;
    },
    mount(element, params){
      const canvas = create_canvas(element);
      const screen = Screen(canvas.getContext('2d'));
      screen.width = element.getAttribute('width');
      screen.height = element.getAttribute('height');
      let view_id = element.getAttribute('data-control');
      let param_path = element.getAttribute('data-param');
      const view = factory[view_id]({element, screen});
      let param = null;
      (param_path || '')
        .split('.')
        .forEach(key => {
          console.log(key);
          console.log(params);
          param = params[key]
        });
      if(!is_nil(param)){
        view.param = param;
      }
      return view;
    },
    bindParameter(desc, param){
      const view = factory[desc.factory](desc.options);
      view.param = param;
      return view;
    }
  }
}
