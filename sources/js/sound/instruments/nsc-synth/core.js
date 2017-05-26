import Poly from 'sound/synth/poly';
import Filter from 'sound/synth/filter';
// import Enveloppe from 'sound/synth/enveloppe';
import Lfo from 'sound/synth/lfo';
import Amp from 'sound/synth/amp';
import Note from 'sound/sequencer/note';

export default function NscSynth({audio_context}) {

  const poly = Poly({audio_context});
  const filter = Filter({audio_context});
  // const enveloppe = Enveloppe({audio_context});
  const lfo = Lfo({audio_context});
  const amp = Amp({audio_context});
  const tune = -1;
  amp.gain.value = .25;
  filter.frequency.value = 1;
  poly
    .setType('square')
    .connect(filter)
    .connect(amp)

  // enveloppe.connect(poly);
  lfo.connect(filter);

  return {
    poly,
    filter,
    // enveloppe,
    lfo,
    amp,
    noteOn(note, octave, time, velocity = 1){
      poly.noteOn(Note.getFrequency(note, octave + tune), time, velocity);
    },
    noteOff(note, octave, time){
      poly.noteOff(Note.getFrequency(note, octave + tune), time);
    },
    stop(){
      poly.stop()
    },
    connect({input}){
      amp.connect({input});
    }
  }
}
