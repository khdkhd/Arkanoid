import Mono from 'sound/synth/mono';
import Filter from 'sound/synth/filter';
import Enveloppe from 'sound/synth/enveloppe';
import Lfo from 'sound/synth/lfo';
import Amp from 'sound/synth/amp';
import Note from 'sound/sequencer/note';

export default function NscSynth({audio_context}) {

  const mono = Mono({audio_context});
  const filter = Filter({audio_context});
  const enveloppe = Enveloppe({audio_context});
  const lfo = Lfo({audio_context});
  const amp = Amp({audio_context});

  amp.gain.value = 1;
  filter.frequency.value = 1;
  mono
    .connect(filter)
    .connect(amp);
  enveloppe.connect(mono);
  lfo.connect(filter);

  return {
    mono,
    filter,
    enveloppe,
    lfo,
    amp,
    noteOn(note, octave, time, velocity = 1){
      mono.noteOn(Note.getFrequency(note, octave), time, velocity);
    },
    noteOff(note, octave, time){
      mono.noteOff(time);
    },
    connect({input}){
      amp.connect({input});
    }
  }
}
