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
		set type(type){
			filter.type = type;
		},
		set frequency(value){
			filter.frequency.value = value;
			state.emitter.emit('frequency-change', value);
		},
		get frequency(){
			return filter.frequency;
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
		emitter: new EventEmitter()
	};
	return assign(state.emitter, create_biquad_filter(state));
}
