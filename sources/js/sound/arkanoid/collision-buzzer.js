import { createSynth, createMixer, createKeyboard } from 'sound';


const patch = {
	nodes: [
		{
			id: 'generator',
			factory: 'polyphonic_generator',
			voice: true,
			options: {
				num_voices: 2
			},
			config: {
				gain: {
					value: .5
				},
				type: {
					value: 'square'
				},
				attack: {
					value: 0,
					views: [
						{
							factory: 'fader',
							options: {
								pos: {
									x: 100,
									y: 150
								},
								width: 30,
								height: 100,
							}
						}
					]
				},
				decay : {
					value: 1,
					views: [
						{
							factory: 'fader',
							options: {
								pos: {
									x: 130,
									y: 150
								},
								width: 30,
								height: 100,
							}
						}
					]
				},
				sustain: {
					value: 1,
					views: [
						{
							factory: 'fader',
							options: {
								pos: {
									x: 160,
									y: 150
								},
								width: 30,
								height: 100,
							}
						}
					]
				},
				release: {
					value: 0,
					views: [
						{
							factory: 'fader',
							options: {
								pos: {
									x: 190,
									y: 150
								},
								width: 30,
								height: 100,
							}
						}
					]
				}
			}
		},
		{
			id: 'filter',
			factory: 'biquad_filter',
			output: true,
			config: {
				frequency: {
					value: .25,
					views: [
						{
							factory: 'knob',
							options: {
								pos: {
									x: 100,
									y: 100
								},
								radius: 20
							}
						}
					]
				},
				Q: {
					value: .75,
					views: [
						{
							factory: 'knob',
							options: {
								pos: {
									x: 150,
									y: 100
								},
								radius: 20
							}
						}
					]
				},
				type : {
					value: 'bandpass'
				}
			},
		},
		{
			id: 'lfo',
			factory: 'lfo',
			config: {
				frequency: {
					value: 0,
					views: [
						{
							factory: 'knob',
							options: {
								pos: {
									x: 200,
									y: 100
								},
								radius: 20
							}
						}
					]
				},
				gain: {
					value: .1
				},
				type: {
					value: 'square'
				}
			}
		}
	],
	connexions: [
		['generator', 'filter'],
		['lfo', 'filter']
	]

};

function create_collision_buzzer(state){
	const mixer = createMixer(state.audio_context);
	const synth = createSynth(state.audio_context);
	const keyboard = createKeyboard();
	synth.patch(patch);
	keyboard.assign(synth);
	mixer.assign('collision_keyboard', synth);
	mixer.connect({input:state.audio_context.destination});
	mixer.tracks['collision_keyboard'].gain.value = 1;
	return {
		buzz(){
			keyboard.playNote({note: 'C', octave: 3, duration: .25});
		}
	};
}

export default audio_context => {
	const state = {
		audio_context: audio_context
	}
	return create_collision_buzzer(state);
}
