import grid from 'sound/controls/grid';
import { get_cursor_position } from 'sound/common/utils';
import ui from 'sound/controls/ui';
import is_nil from 'lodash.isnil';

export default ({element, screen}) => {

  screen.width = Math.round(screen.width/32)*32;
  screen.height = Math.round(screen.height/12)*12 ;
  const canvas = element.querySelector('canvas');
  const grids = {};
  let current_grid;
  const width = screen.width;
  const height = screen.height;

  ui.bind_events({
    element,
    mousedown(event){
      current_grid.mousedown(get_cursor_position(canvas, event));
    }
  });

  return {

    addTrack(track){
      grids[track.id] = grid({width, height, track});
    },

    selectTrack(track){
      if(!is_nil(current_grid)){
        screen.remove(current_grid);
      } else {
        grids[track.id] = grid({width, height, track});
      }
      current_grid = grids[track.id];
      screen.add(current_grid);
    },

    render(){
      screen.clear();
      screen.render();
    }
  }

}
