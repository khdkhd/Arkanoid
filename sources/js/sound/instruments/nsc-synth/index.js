import Core from './core'

import Knob from 'sound/ui/canvas/knob'
// import Fader from 'sound/ui/canvas/fader2'
import GroupView from 'sound/ui/common/group-view';

export default({audio_context}) => {

  const core = Core({audio_context});

  const filterFreqKnob = Knob({
    width: 50,
    height: 50
  }).setParam(core.filter.frequency)

  const filterQKnob = Knob({
    width: 50,
    height: 50
  }).setParam(core.filter.Q);

  const lfoFreqKnob = Knob({
    width: 50,
    height: 50
  }).setParam(core.lfo.frequency);

  const lfoAmpKnob = Knob({
    width: 50,
    height: 50
  }).setParam(core.lfo.amplitude);


  const filterView = GroupView({
    classNames: ['row', 'nsc-filter'],
    tagName: 'div'
  })
  .add(filterFreqKnob)
  .add(filterQKnob)
  .add(lfoFreqKnob)
  .add(lfoAmpKnob)

  const keys = {
    'q': 'A',
    'z': 'A#',
    's': 'B',
    'd': 'C',
    'r': 'C#',
    'f': 'D',
    't': 'D#',
    'g': 'E',
    'h': 'F',
    'y': 'F#',
    'j': 'G',
    'i': 'G#'
  }

  let pressed = []

  function isPressed(key){
    return -1 !== pressed.indexOf(key)
  }

  let octave = 2;

  document.querySelector('body').appendChild(filterView.render().el());

  document.addEventListener('keydown', event => {
    if(keys[event.key] && !isPressed(event.key)) {
      pressed.push(event.key)
      core.noteOn(keys[event.key], octave, 0)
    }
  })
  document.addEventListener('keyup', event => {
    if(keys[event.key]) {
      let note = keys[event.key]
      core.noteOff(note, octave, 0)
      pressed = pressed.filter(key=> key!==event.key)
      // if(pressed.length !== 0){
      //   let key = pressed[pressed.length - 1]
      //   // core.noteOn(keys[key], octave, 0)
      // }
    }
  })
  return core;
}
