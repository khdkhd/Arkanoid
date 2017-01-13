import EventEmitter from 'events';
import { completeAssign as assign } from 'common/utils';

function create_buzz_generator(state) {

	const vco = state.factory['vco'](state.audio_context);
	const vca = state.factory['vca'](state.audio_context);
	const main_vca = state.factory['vca'](state.audio_context);

	const type = assign(new EventEmitter(), {
		set value(value){
			vco.type.value = value;
			this.emit('change', value);
		},
		get value(){
			return vco.type.value;
		}
	});

	return {
		connect({input}) {
			vco.connect(vca);
			vca.connect(main_vca);
			main_vca.connect({input});
		},
		noteOn(freq, time) {
			console.log(freq, time);
			vco.noteOn(freq, time);
			vca.gain.setValueAtTime(1, time);
		},
		noteOff(freq = null, time){
			vca.gain.setValueAtTime(0, time);
		},
		get type(){
			return type;
		},
		get gain(){
			return main_vca.gain;
		},
	};
}

export default(audio_context, {factory})=> {
	const state = {
		audio_context: audio_context,
		factory: factory
	};
	return create_buzz_generator(state);
}
