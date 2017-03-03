import Screen from 'graphics/screen';
import grid from 'sound/sequencer/view/grid';
import { get_cursor_position } from 'sound/common/utils';
import ui from 'sound/controls/ui';
import is_nil from 'lodash.isnil';

export default ({element, width, height}) => {

  const grids = {};
  let current_grid;

  const canvas = document.createElement('canvas');
  canvas.innerHTML = 'Your browser does not support canvas!';
  const screen = Screen(canvas.getContext('2d'));
  screen.width = width;
  screen.height =  height;
  element.appendChild(canvas);


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
