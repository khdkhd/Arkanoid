import amp from 'sound/synth/amp';

export default({audio_context}) => {
const amplifier = amp({audio_context});

	return {
		connect({input}) {
			amplifier.connect({input});
		},
		assign(instrument) {
			instrument.connect({input: amplifier});
		},
		get gain(){
			return amplifier.gain;
		}
	};
}
