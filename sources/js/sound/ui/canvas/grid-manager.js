import grid from 'sound/controls/grid';
import { get_cursor_position } from 'sound/common/utils';
import ui from 'sound/controls/ui';
import is_nil from 'lodash.isnil';
import { completeAssign as assign } from 'common/utils';
import times from 'lodash.times';
import { default as GraphicsView, MouseEventsHandler } from 'ui/graphics-view';


let current_grid;
const grids = {};

function view(state){

  state.screen.width = Math.round(state.screen.width/32)*32;
  state.screen.height = Math.round(state.screen.height/12)*12 ;
  state.canvas = state.element.querySelector('canvas');
  state.width = state.screen.width;
  state.height = state.screen.height;


  times(10, i => {
    grids[i] = grid({width: state.width, height: state.height})
  });

  return {
    render(){
      state.screen.clear();
      state.screen.render();
    }
  };
}

function controller(state){


  ui.bind_events({
    element: state.element,
    mousedown(event){
      if(!is_nil(current_grid)){
        current_grid.mousedown(get_cursor_position(state.canvas, event));
      }
    }
  });

  return {
    set sequencer(sequencer){
      state.sequencer = sequencer;
      sequencer.track.on('change:track', ({key,track}) => {
        if(!is_nil(current_grid)){
          state.screen.remove(current_grid);
        }
        grids[key].track = track
        current_grid = grids[key];
        state.screen.add(current_grid);
      });
      sequencer.pattern.on('change',() => {
        if(!is_nil(current_grid)){
         current_grid.updatePattern()
        }
      });
    }
  }
}

export default ({element, screen}) => {
  const state = {
    element,
    screen
  }
  return assign(view(state), controller(state));
}
