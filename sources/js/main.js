import Game from 'game';
import {createSynth as Synth, createSequencer as Sequencer } from 'sound-engine';

const audio_context = new AudioContext();
const notes = ['C', 'A', 'A#', 'B', 'E', 'F', 'G#', 'C#'];
const synth = Synth(audio_context);
const seq = Sequencer(synth, audio_context);
synth.patch();
seq.playSequence({notes:notes, duration:.25});
const game = Game();
game.start();
