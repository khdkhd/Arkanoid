import EventEmitter from 'events';
import { completeAssign as assign } from 'common/utils';

function create_lfo(state){
	const osc = state.audio_context.createOscillator();
	const gain = state.audio_context.createGain();
	return {
		connect({param}){
			osc.connect(gain);
			gain.connect(param);
			osc.start();
		},
		set frequency(value){
			osc.frequency.value = value;
			state.emitter.emit('frequency-change', value);
		},
		set amplitude(value){
			gain.gain.value = value;
			state.emitter.emit('amplitude-change', value);
		},
		set form(type){
			osc.type = type;
		}
	};
}

export default(audio_context)=> {
	const state = {
		audio_context: audio_context,
		emitter: new EventEmitter()
	};
	return assign(state.emitter, create_lfo(state));
}
