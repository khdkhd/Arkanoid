import knob from 'sound/controls/knob';
import fader from 'sound/controls/fader';
import grid_manager from 'sound/controls/grid-manager';
import keyboard from 'sound/controls/keyboard';
import spinbox from 'sound/controls/spinbox';
import track_selector from 'sound/controls/track-selector';
import Screen from 'graphics/screen';
import is_nil from 'lodash.isnil';

const factory = {
  fader,
  knob,
  grid: grid_manager,
  keyboard,
  spinbox,
  track_selector
};

export function createCanvas(element){
  const canvas = document.createElement('canvas');
  canvas.innerHTML = 'Your browser does not support canvas!';
  element.appendChild(canvas);
  return canvas;
}

/*
 * parses path using dot as a separator and returns
 * a reference to the nested object in params
 */
export function parse_parameters(path, params){
	let param = params;
	(path || '').split('.')
		.forEach(
			key=> param = param ? param[key]: params[key]
		);
	return param;
}

export default () => {
  return {
    get factory(){
      return factory;
    },
    mount(element, device){
      const canvas = createCanvas(element);
      const screen = Screen(canvas.getContext('2d'));
      screen.width = element.getAttribute('width');
      screen.height = element.getAttribute('height');
      let view_id = element.getAttribute('data-control');
      let param_path = element.getAttribute('data-param');
      const view = factory[view_id]({element, screen});
      let param = parse_parameters(param_path, device);
      if(!is_nil(param)){
        view.param = param;
      }
      return view;
    }
  }
}
