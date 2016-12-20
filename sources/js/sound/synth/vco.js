import EventEmitter from 'events';
import { completeAssign as assign } from 'common/utils';

function create_vco(state) {
	const osc = state.audio_context.createOscillator();
	const type = assign(new EventEmitter(), {
		set value(value){
			osc.type = value;
		},
		get value(){
			return osc.type;
		}
	});

	return {
		connect({input}) {
			osc.connect(input);
			osc.start(0);
		},
		gateOn(freq, time) {
			osc.frequency.setValueAtTime(freq, time);
		},
		get type(){
			return type;
		}
	};
}

export default(audio_context)=>{
	const state = {
		audio_context: audio_context
	};
	return create_vco(state);
}
