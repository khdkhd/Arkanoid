import EnveloppeGenerator from 'sound/synth/enveloppe-generator';
import EventEmitter from 'events';
import { completeAssign as assign } from 'common/utils';

function create_biquad_filter(state){
	const filter = state.audio_context.createBiquadFilter();
	const enveloppe = EnveloppeGenerator();
	return {
		connect({input}){
			filter.connect(input);
			enveloppe.connect({input: filter.gain});
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
		set type(type){
			filter.type = type;
		},
		set frequency(value){
			console.log('value', value);
			filter.frequency.value = value;
			state.emitter.emit('frequency-change', value);
		},
		get frequency(){
			return assign(state.emitter, {
					set value(value){
						filter.frequency.value = (state.frequency_range.max - state.frequency_range.min) * value;
						state.emitter.emit('change', value);
					},
					get value(){
						return filter.frequency.value/(state.frequency_range.max - state.frequency_range.min);
					}
			});
		},
		get gain(){
			return filter.gain;
		},
		set gain(value){
			filter.gain.value = value;
			state.emitter.emit('gain-change', value);
		},
		set attack(value){
			enveloppe.attack = value;
			state.emitter.emit('attack-change', value);
		},
		set decay(value){
			enveloppe.decay = value;
			state.emitter.emit('decay-change', value);
		},
		set sustain(value){
			enveloppe.sustain = value;
			state.emitter.emit('sustain-change', value);
		},
		set release(value){
			enveloppe.release = value;
			state.emitter.emit('release-change', value);

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
	return assign(state.emitter, create_biquad_filter(state));
}
