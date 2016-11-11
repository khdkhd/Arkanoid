import Game from 'game';
import {createSynth as Synth, createSequencer as Sequencer } from 'sound-engine';

const audio_context = new AudioContext();
const notes = ['C', 'A', 'A#', 'B', 'E', 'F', 'G#', 'C#'];
const synth = Synth(audio_context);
const seq = Sequencer(audio_context, {slave:synth});
const patch = {
	nodes: [
		{
			id: 0,
			type: 'polyphonic_generator',
			generator: true,
			options: {
				voices: 2
			},
			config: {
				form: 'square',
				release: .5
			}
		},
		{
			id: 1,
			type: 'biquad_filter',
			config: {
				frequency: 2250,
				gain: 25
			}
		},
		{
			id: 2,
			type: 'lfo',
			config: {
				frequency: 300,
				amplitude: 15,
				form: 'triangle',
			}
		},
		{
			id: 3,
			type: 'master'
		}
	],
	connexions: [
		[0,1],
		[1,3]
	]
};

synth.patch(patch);
//seq.playNote('C', 5, 5);
seq.playSequence({notes:notes ,duration:.25});
const game = Game();
game.start();
