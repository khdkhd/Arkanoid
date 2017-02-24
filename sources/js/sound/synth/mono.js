import { create_audio_model } from 'sound/common/utils';


export default({audio_context}) => {

	let _osc;
	let _type = 'sine';

	const gain = audio_context.createGain();

	const type = create_audio_model({
		param: {
			get value(){
				return _type;
			},
			set value(value){
				_type = value;
			}
		}
	});

	const _param = create_audio_model({
		param: gain.gain
	});

	return {
		connect({input}) {
			gain.connect(input);
		},
		noteOn(freq, time) {
			_osc = audio_context.createOscillator();
			_osc.frequency.value = freq;
			_osc.type = _type;
			_osc.connect(gain);
			_param.emit('noteon', time);
			_osc.start(time);
		},
		noteOff(time){
			if(!_param.isControlled){
				return _osc.stop(time);
			}
			_param.emit('noteoff', {
				time,
				onComplete(time){
					_osc.stop(time);
				}
			});
		},
		get type(){
			return type;
		},
		get param(){
			return _param;
		}
	};
}
