import { create_audio_model } from 'sound/common/utils';
import constant from 'lodash.constant';

export default({audio_context}) => {

	const _gain = audio_context.createGain();

	const gain = create_audio_model({
		param: _gain,
		init: constant(0),
		range: {
			min: -1,
			max: 1
		}
	});

	return {
		connect({input}) {
			_gain.connect(input);
		},
		get input() {
			return _gain;
		},
		get gain(){
			return gain;
		},
		get param(){
			return _gain.gain;
		}
	};
}
