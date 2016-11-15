import {Synth, Seq, Note } from 'sound';
import Game from 'game';


const audio_context = new AudioContext();
const synth = Synth(audio_context);
const seq = Seq(audio_context, {slave:synth});
const patch = {
	nodes: [
		{
			id: 0,
			factory: 'polyphonic_generator',
			type: 'generator',
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
			factory: 'biquad_filter',
			config: {
				frequency: 250,
				gain: 15
			}
		},
		{
			id: 2,
			factory: 'lfo',
			config: {
				form: 'triangle',
				frequency: 100,
				amplitude: 100
			}
		},
		{
			id: 3,
			factory: 'master'
		}
	],
	connexions: [
		[0,1],
		[1,3],
		[2,1]
	]
};

const DURATION = {
	WHOLE: 1,
	HALF: 1/2,
	QUARTER: 1/4,
	EIGHTH: 1/8
}

let pattern = [[
	Note('A',4,DURATION.HALF),
	{},
	{},
	{},
	Note('C#',2,DURATION.HALF),
	{},
	{},
	{},
	Note('A',4,DURATION.HALF),
	{},
	{},
	{},
	Note('B',4,DURATION.HALF),
	{},
	{},
	{},
	Note('A',4,DURATION.HALF),
	{},
	{},
	{},
	Note('E',4,DURATION.HALF),
	{},
	{},
	{},
	Note('A',4,DURATION.HALF),
	{},
	{},
	{},
	Note('E',4,DURATION.HALF),
	{},
	{},
	{}
]];
synth.patch(patch);
seq.loadPattern(pattern);
seq.start();
seq.play();
const game = Game();
game.start();
