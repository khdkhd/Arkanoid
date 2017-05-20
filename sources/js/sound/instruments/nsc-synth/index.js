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

  document.querySelector('body').appendChild(filterView.render().el());

  return core;
}
