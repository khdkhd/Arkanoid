import Model from 'sound/common/model';

export default({audio_context}) => {

	const gain = audio_context.createGain();

	const state = {
		osc: {
			disconnect(){},
			stop(){}
		},
		gain,
		type: Model({
			init(){
				return 'square'
			}
		}),
		envIn: Model({
			param: gain.gain
		})
	}

	return {
		connect({input, connect}) {
			state.gain.connect(input);
			return {connect};
		},
		noteOn(freq, time, velocity = 1) {
			state.osc.stop(time);
			state.osc.disconnect()
			state.osc = audio_context.createOscillator();
			state.osc.frequency.value = freq;
			state.osc.type = state.type.value;
			state.gain.gain.value *= velocity;
			state.osc.connect(state.gain);
			state.envIn.emit('noteon', time);
			state.osc.start(time);
		},
		noteOff(freq, time){
			if(!state.envIn.hasEnv){
				return state.osc.stop(time);
			}
			state.envIn.emit('noteoff', {
				time,
				onComplete(time){
					state.osc.stop(time);
				}
			});
		},
		getType(){
			return state.type;
		},
		setType(value){
			state.type.value = value
		},
		get envIn(){
			return state.envIn;
		}
	};
}
