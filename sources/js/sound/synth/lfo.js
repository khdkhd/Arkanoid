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
		get frequency(){
			return assign(
				state.emitter,{
					set value(value) {
						osc.frequency.value = (state.frequency_range.max - state.frequency_range.min) * value;
						state.emitter.emit('change', value);
					},
					get value(){
						return osc.frequency.value/(state.frequency_range.max - state.frequency_range.min);
					}
			});
		},
		get gain(){
			return assign(
				state.emitter,
				gain.gain, {
					set value(value){
						gain.gain.value = value;
						state.emitter.emit('change', value);
					}
				}
			);
		},
		set amplitude(value){
			gain.gain.value = value;
			state.emitter.emit('amplitude-change', value);
		},
		get type(){
			return {
				set value(value){
					osc.type = value;
				}
			}
		}
	};
}

export default(audio_context)=> {
	const state = {
		audio_context: audio_context,
		emitter: new EventEmitter(),
		frequency_range :{
			min: 0,
			max: 2000
		}
	};
	return assign(state.emitter, create_lfo(state));
}
