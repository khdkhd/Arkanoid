import knob from 'sound/controls/knob';
import fader from 'sound/controls/fader';

const factory = {
  fader,
  knob
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
