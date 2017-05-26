import { Core } from './core'
import Grid from './grid'

export default ({audio_context}) => {
  const core = Core({audio_context});
  const grid = Grid({
    width: 800,
    height: 300
  }).setSequencer(core)
  document.querySelector('body').appendChild(grid.render().el());
  document.addEventListener('keyup', event => {
    switch(event.key){
      case ' ':
        return core.isStarted() ? core.stop() : core.start()
    }
  });
  return core
}
