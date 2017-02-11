import knob from 'sound/controls/knob';
import fader from 'sound/controls/fader';
import grid from 'sound/controls/grid';

const factory = {
  fader,
  knob,
  grid
};

export default () => {
  return {
    get factory(){
      return factory;
    },
    bindParameter(desc, param){
      const view = factory[desc.factory](desc.options);
      view.param = param;
      return view;
    }
  }
}
