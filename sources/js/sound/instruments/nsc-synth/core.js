import Mono from 'sound/synth/mono';
import Filter from 'sound/synth/filter';
import Enveloppe from 'sound/synth/enveloppe';
import Lfo from 'sound/synth/lfo';
import amp from 'sound/synth/amp';

export default({audio_context}) => {

  const mono = Mono({audio_context});
  const filter = Filter({audio_context});
  const enveloppe = Enveloppe({audio_context});
  const lfo = Lfo({audio_context});

  mono
    .connect(filter)
    .connect(amp);
  enveloppe.connect(mono);
  lfo.connect(filter);
  
  return {
    mono,
    filter,
    enveloppe,
    lfo
  }
}
