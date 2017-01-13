import EventEmitter from 'events';
import { completeAssign as assign } from 'common/utils';
import { scale, unscale } from 'sound/common/utils';

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
				new EventEmitter(),{
					set value(value) {
						osc.frequency.value = scale(state.frequency_range, value);
						this.emit('change', value);
					},
					get value(){
						return unscale(state.frequency_range, osc.frequency.value);
					}
			});
		},
		get gain(){
			return assign(
				new EventEmitter(), {
					set value(value){
						gain.gain.value = scale(state.gain_range, value);
						this.emit('change', value);
					},
					get value(){
						return unscale(state.gain_range, gain.gain.value);
					}
				}
			);
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
		frequency_range :{
			min: 0,
			max: 20
		},
		gain_range: {
			min: 500,
			max: 1000
		}
	};
	return create_lfo(state);
}
