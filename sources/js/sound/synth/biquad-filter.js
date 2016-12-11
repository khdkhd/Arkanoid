import EnveloppeGenerator from 'sound/synth/enveloppe-generator';
import EventEmitter from 'events';
import { completeAssign as assign } from 'common/utils';
import { scale, unscale } from 'sound/common/utils';

function create_biquad_filter(state){

	const filter = state.audio_context.createBiquadFilter();
	const enveloppe = EnveloppeGenerator();

	const frequency = assign(new EventEmitter(),{
		set value(value){
			filter.frequency.value = scale(state.frequency_range, value);
			this.emit('change', value);
		},
		get value(){
			return unscale(state.frequency_range, filter.frequency.value);
		}
	});

	const gain = assign(new EventEmitter(), {
		set value(value) {
			filter.gain.value = scale(state.gain_range, value);
			this.emit('change', value);
		},
		get value(){
			return unscale(state.gain_range, filter.gain.value);
		}
	});

	const Q = assign(new EventEmitter(), {
		set value(value){
			filter.Q.value = scale(state.Q_range, value);
			this.emit('change', value);
		},
		get value(){
			return unscale(state.Q_range, filter.Q.value);
		}
	});


	const type = assign (new EventEmitter(),{
		set value(value) {
			filter.type = value;
		},
		get value(){
			return filter.type;
		}
	});

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
			return type;
		},
		get frequency(){
			return frequency;
		},
		get gain(){
			return gain;
		},
		get Q(){
			return Q;
		},
		get attack(){
			return enveloppe.attack;
		},
		get decay(){
			return enveloppe.decay;
		},
		get sustain(){
			return enveloppe.sustain;
		},
		get release(){
			return enveloppe.release;
		}
	};
}

export default(audio_context)=> {
	const state = {
		audio_context: audio_context,
		frequency_range :{
			min: 0,
			max: 2500
		},
		gain_range: {
			min: 0,
			max: 10
		},
		Q_range: {
			min: 0,
			max: 100
		}
	};
	return create_biquad_filter(state);
}
