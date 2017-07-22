import Poly from 'sound/synth/poly';
import Filter from 'sound/synth/filter';
import Lfo from 'sound/synth/lfo';
import Amp from 'sound/synth/amp';
import { Reverb } from 'sound/synth/reverb';
import { Note } from 'sound/sequencer';

export default ({audio_context})=> {

  const osc1 = Poly({audio_context});
//   const osc2 = Poly({audio_context});
  const filter = Filter({audio_context});
  const lfo = Lfo({audio_context});
  const amp = Amp({audio_context});
  const reverb = Reverb({audio_context});
  const osc1Tune = -1;
//   const osc2Tune = 0;

  amp.gain.value = .25;
  filter.frequency.value = 1;
  reverb.setImpulse('../../resources/impulse-responses/slinky.wav')
    .subscribe(()=> {
      osc1
        .connect(filter)
        .connect(reverb)
        .connect(amp)
	//   osc2
    //     .connect(filter)
    //     .connect(reverb)
    //     .connect(amp)
  });
  // enveloppe.connect(osc1);
  lfo.connect(filter);

  return {
    filter,
    // enveloppe,
    lfo,
    amp,
    noteOn(note, octave, time, velocity){
      osc1.noteOn(Note.getFrequency(note, octave + osc1Tune), time, velocity * .25);
    //   osc2.noteOn(Note.getFrequency(note, octave + osc2Tune), time, velocity * .25);
    },
    noteOff(note, octave, time){
      osc1.noteOff(Note.getFrequency(note, octave + osc1Tune), time);
    //   osc2.noteOff(Note.getFrequency(note, octave + osc2Tune), time);
    },
    stop(){
      osc1.stop()
    //   osc2.stop()
    },
    connect({input}){
      amp.connect({input});
    }
  }
}
