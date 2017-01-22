import { create_audio_model } from 'sound/common/utils';
import constant from 'lodash.constant';

export default({audio_context}) => {

	const vca = audio_context.createGain();
	const gain = create_audio_model({
		param: vca.gain,
		init: constant(0),
		range: {
			min: -1,
			max: 1
		}
	});

	return {
		connect({input}) {
			vca.connect(input);
		},
		get input() {
			return vca;
		},
		get gain(){
			return gain;
		}
	};
}
