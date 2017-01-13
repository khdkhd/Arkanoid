import create_vca from 'sound/synth/vca';

function create_track(state){

	const gain = create_vca(state.audio_context);

	return {
		connect({input}) {
			gain.connect({input});
		},
		assign(instrument) {
			instrument.connect({input:gain});
		},
		get gain(){
			return gain.gain;
		}
	};
}

export default(audio_context) => {
	const state = {
		audio_context: audio_context
	};
	return create_track(state);
}
