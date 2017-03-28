import AudioParam  from 'sound/common/model';

export default({audio_context}) => {

	const gain = AudioParam({
		param: audio_context.createGain(),
		init(){
			return 1;
		},
		range: {
			min: 0,
			max: 1
		}
	})

	return {
		connect({input}) {
			gain.param.connect(input);
		},
		assign(instrument) {
			instrument.connect({ input: gain.param });
		},
		get input(){
			return gain.param;
		},
		get gain(){
			return gain;
		}
	};
}
