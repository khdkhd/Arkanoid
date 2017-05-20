import Model from 'sound/common/model';

export default({audio_context}) => {

	let osc;
	let type_value = 'sine';

	const gain = audio_context.createGain();

	const type = Model({
		param: {
			get value(){
				return type;
			},
			set value(value){
				type_value = value;
			}
		}
	});

	const envIn = Model({
		param: gain.gain
	});

	return {
		connect({input, connect}) {
			gain.connect(input);
			return {connect};
		},
		noteOn(freq, time, velocity = 1) {
			osc = audio_context.createOscillator();
			osc.frequency.value = freq;
			osc.type = type_value;
			gain.gain.value *= velocity;
			osc.connect(gain);
			envIn.emit('noteon', time);
			osc.start(time);
		},
		noteOff(time){
			if(!envIn.hasEnv){
				return osc.stop(time);
			}
			envIn.emit('noteoff', {
				time,
				onComplete(time){
					osc.stop(time);
				}
			});
		},
		get type(){
			return type;
		},
		get envIn(){
			return envIn;
		}
	};
}
