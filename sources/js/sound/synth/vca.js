import EventEmitter from 'events';

function create_vca(state) {
	const vca = state.audio_context.createGain();
	vca.gain.value = 0;
	return {
		connect({input}) {
			vca.connect(input);
		},
		setValueAtTime(value, time) {
			vca.gain.setValueAtTime(value, time)
		},
		linearRampToValueAtTime(value, time) {
			vca.gain.linearRampToValueAtTime(value, time);
		},
		cancelScheduledValues(time){
			vca.gain.cancelScheduledValues(time);
		},
		get input() {
			return vca;
		},
		get gain(){
			return vca.gain;
		},
		set value(value){
			vca.gain.value = value;
		}
	};
}

export default(audio_context) => {
	const state = {
		audio_context: audio_context,
		emitter: new EventEmitter(),
		gain: 0
	};
	return Object.assign(state.emitter, create_vca(state));
}
