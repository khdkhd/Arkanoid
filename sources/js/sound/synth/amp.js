import Model  from 'sound/common/model';
import constant from 'lodash.constant';

export default({audio_context}) => {

	const _gain = audio_context.createGain();

	const gain = Model({
		param: _gain.gain,
		init: constant(0),
		range: {
			min: 0,
			max: 1
		}
	});

	return {
		connect({input, connect}) {
			_gain.connect(input);
			return {connect};
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
