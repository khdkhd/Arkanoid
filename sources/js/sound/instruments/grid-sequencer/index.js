import Core from './core'
import GridSequencer from 'sound/ui/canvas/grid'

export default ({audio_context}) => {
  const core = Core({audio_context});
  const grid = GridSequencer({
    width: 800,
    height: 300
  }).setSequencer(core.sequencer)
  document.querySelector('body').appendChild(grid.render().el());
  document.addEventListener('keyup', event => {
    switch(event.key){
      case ' ':
        return core.sequencer.isStarted() ? core.sequencer.stop() : core.sequencer.play()
    }
  });
  return core.sequencer
}
