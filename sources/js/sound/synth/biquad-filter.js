import EnveloppeGenerator from 'sound/synth/enveloppe-generator';
import EventEmitter from 'events';
import { completeAssign as assign } from 'common/utils';

function create_biquad_filter(state){
	const filter = state.audio_context.createBiquadFilter();
	const enveloppe = EnveloppeGenerator();
	return {
		connect({input}){
			filter.connect(input);
			enveloppe.connect({ input: filter.gain });
		},
		get input(){
			return filter;
		},
		get param(){
			return filter.frequency;
		},
		get type(){
			return {
				set value(value) {
					filter.type = value;
				}
			}
		},
		get frequency(){
			return assign(new EventEmitter(), {
					set value(value){
						filter.frequency.value = (state.frequency_range.max - state.frequency_range.min) * value;
						this.emit('change', value);
					},
					get value(){
						return filter.frequency.value/(state.frequency_range.max - state.frequency_range.min);
					}
			});
		},
		get gain(){
			return assign(new EventEmitter(), {
				set value(value) {
					filter.gain.value = (state.gain_range.max - state.gain_range.min) * value;
					this.emit('change', value);
				},
				get value(){
					return filter.gain.value/(state.gain_range.max - state.gain_range.min);
				}
			});
		},
		get attack(){
			return assign(new EventEmitter(), {
				set value(value){
					enveloppe.attack = value;
					this.emit('change', value);
				}
			});
		},
		get decay(){
			return assign(new EventEmitter(), {
				set value(value){
					enveloppe.decay = value;
					this.emit('change', value);
				}
			});
		},
		get sustain(){
			return assign(new EventEmitter(), {
				set value(value){
					enveloppe.sustain = value;
					this.emit('change', value);
				}
			});
		},
		get release(){
			return assign(new EventEmitter(), {
				set value(value){
					enveloppe.release = value;
					this.emit('change', value);
				}
			});
		}
	};
}

export default(audio_context)=> {
	const state = {
		audio_context: audio_context,
		frequency_range :{
			min: 1150,
			max: 4200
		},
		gain_range: {
			min: 0,
			max: 50
		}
	};
	return create_biquad_filter(state);
}
