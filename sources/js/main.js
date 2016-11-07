import Game from 'game';
import {createSynth as Synth, createSequencer as Sequencer } from 'sound-engine';

const audio_context = new AudioContext();
const notes = ['C', 'D', 'C', 'D', 'C', 'F', 'D', 'G','C', 'D', 'C', 'D', 'C', 'F', 'D', 'G'];
const synth = Synth(audio_context);
const seq = Sequencer(synth, audio_context);
synth.patch();
seq.playSequence({notes:notes, duration:.25});
const game = Game();
game.start();
