import GridScene from 'sound/ui/canvas/grid-scene';
import { getCanvasEventPosition } from 'sound/common/utils';
import is_nil from 'lodash.isnil';
import { completeAssign as assign } from 'common/utils';
import times from 'lodash.times';
import { default as GraphicsView, MouseEventsHandler } from 'ui/graphics-view';


let current_grid;
const grids = {};

const View = state => {

  const view = GraphicsView({
    domEvents: MouseEventsHandler({
      onMouseDown(view, event){
        if(!is_nil(current_grid)){
          current_grid.updateCell(getCanvasEventPosition(event));
          current_grid.render(view.screen())
        }
      }
    }),
    onBeforeRender(screen){
      screen.setSize({
        width: Math.round(state.width/32)*32,
        height: Math.round(state.height/12)*12
      })
      state.width = screen.width;
      state.height = screen.height;
      times(10, i => {
        grids[i] = GridScene({width: state.width, height: state.height})
      });
      view.screen().add(grids[0]);
      current_grid = grids[0];
    }
  });
  return view;
}

const Controller = state => {
  return {
    setSequencer(sequencer){
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
      return this;
    }
  }
}


export default ({width, height}) => {
  const state = {
    width,
    height
  }
  return assign(View(state), Controller(state));
}
