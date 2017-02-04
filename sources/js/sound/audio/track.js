import amp from 'sound/synth/amp';

export default({audio_context}) => {
	const gain = amp({audio_context});

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
