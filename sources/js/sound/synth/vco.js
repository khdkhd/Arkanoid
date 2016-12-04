import EventEmitter from 'events';

function create_vco(state) {
	const osc = state.audio_context.createOscillator();
	return {
		connect({input}) {
			osc.connect(input);
			osc.start(0);
		},
		gateOn(freq, time) {
			osc.frequency.setValueAtTime(freq, time);
		},
		get form(){
			return osc.type;
		},
		set form(type) {
			osc.type = type;
		}
	};
}

export default(audio_context)=>{
	const state = {
		audio_context: audio_context,
		emitter: new EventEmitter()
	};
	return Object.assign(state.emitter, create_vco(state));
}
