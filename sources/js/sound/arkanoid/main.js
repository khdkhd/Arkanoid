import {
	createSequencer,
	createSynth,
	createMixer,
} from 'sound';

const synth_patch = {
	nodes: [{
			id: 'generator',
			factory: 'mono',
			voice: true,
			config: {
				type: {
					value: 'square'
				}
			}
		},
		{
			id: 'enveloppe',
			factory: 'enveloppe'
		},
		{
			id: 'filter',
			factory: 'filter',
			output: true,
			config:{
				frequency:{
					value: .95,
					views: [{
						factory: 'knob',
						options:{
							parent: '#knob-1'
						}
					}]
				},
				Q: {
					value: 0,
					views: [{
						factory: 'knob',
						options:{
							parent: '#knob-2'
						}
					}]
				},
				gain: {
					value: .95
				},
				type: {
					value: 'lowpass'
				}
			},
		},
		{
			id: 'lfo',
			factory: 'lfo',
			config: {
				frequency: {
					value: .125,
					views: [{
						factory: 'knob',
						options:{
							parent: '#knob-3'
						}
					}]
				},
				amplitude: {
					value: 0.9,
					views: [{
						factory: 'knob',
						options:{
							parent: '#knob-4'
						}
					}]
				},
				type: {
					value: 'sine'
				}
			}
		},
	],
	connexions: [
		['generator', 'filter'],
		['lfo', 'filter']
		// ['filter', 'master']
	]

};



const introduction_partition = [
	[{
			note: 'G',
			octave: 2,
			duration: 'WHOLE'
		}, {}, {
			note: 'A',
			octave: 2,
			duration: 'EIGHTH'
		}, {
			note: 'A',
			octave: 2,
			duration: 'EIGHTH'
		},
		{
			note: 'G',
			octave: 2,
			duration: 'WHOLE'
		}, {}, {
			note: 'G',
			octave: 2,
			duration: 'EIGHTH'
		}, {
			note: 'D',
			octave: 5,
			duration: 'EIGHTH'
		},
		{
			note: 'A',
			octave: 2,
			duration: 'WHOLE'
		}, {}, {
			note: 'G',
			octave: 2,
			duration: 'QUARTER'
		}, {},
		{
			note: 'A',
			octave: 4,
			duration: 'WHOLE'
		}, {}, {
			note: 'D',
			octave: 5,
			duration: 'QUARTER'
		}, {}
	],
	[{
			note: 'B',
			octave: 2,
			duration: 'EIGHTH'
		}, {}, {}, {},
		{}, {}, {}, {},
		{}, {}, {}, {},
		{}, {}, {}, {}
	]
];


const audio_context = new AudioContext();


const seq = createSequencer({
	audio_context
});
const synth = createSynth({
	audio_context
});
const mixer = createMixer({
	audio_context
});

synth.patch(synth_patch);
seq.assign('track_1', synth);
seq.tracks['track_1'].grid = introduction_partition;

mixer.assign('1', synth);
mixer.connect({
	input: audio_context.destination
});
mixer.tracks['1'].gain.value = 1;
seq.start();

function loop() {
	seq.play();
	synth.render();
	requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
