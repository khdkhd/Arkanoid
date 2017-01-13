import { createSynth, createMixer, createKeyboard } from 'sound';


const patch = {
	nodes: [
		{
			id: 'generator',
			factory: 'buzz_generator',
			voice: true,
			config: {
				gain: {
					value: 1
				},
				type: {
					value: 'square'
				}
			}
		},
		{
			id: 'filter',
			factory: 'biquad_filter',
			output: true,
			config: {
				frequency: {
					value: 1,
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
					value: 0,
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
					value: 'lowpass'
				}
			},
		},
		{
			id: 'lfo',
			factory: 'lfo',
			config: {
				frequency: {
					value: 0.025,
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
					value: 1
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
	const keyboard = createKeyboard(state.audio_context);
	synth.patch(patch);
	keyboard.assign(synth);
	mixer.assign('collision_keyboard', synth);
	mixer.connect({input:state.audio_context.destination});
	mixer.tracks['collision_keyboard'].gain.value = 1;
	return {
		buzz({note, octave, duration}){
			keyboard.playNote({note: note, octave: octave, duration: duration});
		}
	};
}

export default audio_context => {
	const state = {
		audio_context: audio_context
	}
	return create_collision_buzzer(state);
}
