function create_enveloppe_generator(state){
	let _param;
	return {
		connect({param}){
			_param = param;
		},
		gateOn(time){
			_param.cancelScheduledValues(time);
			_param.setValueAtTime(0, time);
			_param.linearRampToValueAtTime(1, time + state.attack);
			_param.linearRampToValueAtTime(state.sustain, time + state.attack + state.decay);
		},
		gateOff(time){
			_param.cancelScheduledValues(time);
			_param.linearRampToValueAtTime(0, time + state.release);
		},
		set attack(value){
			state.attack = value;
		},
		set decay(value){
			state.decay = value;
		},
		set sustain(value){
			state.sustain = value;
		},
		set release(value){
			state.release = value;
		}
	};
}

export default()=>{
	const state = {
		attack: .0125,
		sustain: .25,
		decay: .00025,
		release: .0025
	};
	return create_enveloppe_generator(state);
}
