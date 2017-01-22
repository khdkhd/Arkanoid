import create_vca from 'sound/synth/vca';

export default({audio_context}) => {
	const gain = create_vca({audio_context});

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
