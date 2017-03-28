import Screen from 'graphics/screen';
import { CompletAssign as assign } from 'common/utils';

export function createCanvas(){
  const canvas = document.createElement('canvas');
  canvas.innerHTML = 'Your browser does not support canvas!';
  return canvas;
}

export default ({factory, width, height}) => {
  const canvas = createCanvas();
  const screen = Screen(canvas.getContext('2d'))
  screen.size = {
    width,
    height
  };
  return factory({element: canvas, screen})
}
