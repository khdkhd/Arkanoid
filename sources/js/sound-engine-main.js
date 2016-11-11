import {createSynth as Synth, createSequencer as Sequencer } from 'sound-engine';
import Game from 'game';


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
				release: .125
			}
		},
		{
			id: 1,
			type: 'biquad_filter',
			config: {
				frequency: 1550,
				gain: 15
			}
		},
		{
			id: 2,
			type: 'lfo',
			config: {
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
seq.playNote('C', 4, .25);
const game = Game();
game.start();
