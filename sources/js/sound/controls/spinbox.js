import Vector from 'maths/vector';
import Rect from 'maths/rect';
import EventEmitter from 'events';
import _clamp from 'lodash.clamp';
import { completeAssign as assign } from 'common/utils';
import { scale, unscale } from 'sound/common/utils';
import ui from 'sound/controls/ui';
import Screen from 'graphics/screen';

function create_arrow_button(state) {

}

function create_spinbox_view(state) {

}

function create_spinbox_controller(state) {

}

export default ({element}) => {
  const state = {
		element,
    emitter: new EventEmitter()
  };
  return Object.assign(state.emitter, create_spinbox_view(state), create_spinbox_controller(state));
}
