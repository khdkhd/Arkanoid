import EventEmitter from 'events';
import { completeAssign as assign } from 'common/utils';

function create_vca(state) {
	const vca = state.audio_context.createGain();
	vca.gain.value = 0;

	const gain = assign(new EventEmitter(), {
		set value(value){
			vca.gain.value = value;
			this.emit('change', value);
		},
		get value(){
			return vca.gain.value;
		}	,setValueAtTime(value, time) {
			vca.gain.setValueAtTime(value, time)
		},
		linearRampToValueAtTime(value, time) {
			vca.gain.linearRampToValueAtTime(value, time);
		},
		cancelScheduledValues(time){
			vca.gain.cancelScheduledValues(time);
		},
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

export default(audio_context) => {
	const state = {
		audio_context: audio_context,
		gain: 0
	};
	return create_vca(state);
}
