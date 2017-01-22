import { create_audio_model } from 'sound/common/utils';

export default({audio_context}) => {
	const osc = audio_context.createOscillator();

	const type = create_audio_model({
		param: {
			get value(){
				return osc.type;
			},
			set value(value){
				osc.type = value;
			}
		}
	});

	return {
		connect({input}) {
			osc.connect(input);
			osc.start(0);
		},
		noteOn(freq, time) {
			osc.frequency.setValueAtTime(freq, time);
		},
		get type(){
			return type;
		}
	};
}
