import VCO from 'sound/synth/vco';
import VCA from 'sound/synth/vca';
import EnveloppeGenerator from 'sound/synth/enveloppe-generator';
import times from 'lodash.times';
import EventEmitter from 'events';
import { scale, unscale } from 'sound/common/utils';
import { completeAssign as assign } from 'common/utils';

function create_polyphonic_generator(state) {

	const vcos = times(state.num_voices, () => VCO(state.audio_context));
	const vcas = times(state.num_voices, () => VCA(state.audio_context));
	const enveloppes = times(state.num_voices, () => EnveloppeGenerator());
	const channel_merger = state.audio_context.createChannelMerger(state.num_voices);
	const polyphony_manager = create_polyphony_manager(state.num_voices);


	const type = assign(new EventEmitter(), {
		set value(value){
			vcos.forEach(vco => vco.type.value = value);
			this.emit('change', value);
		},
		get value(){
			return vcos[0].type.value;
		}
	});

	const gain = assign(new EventEmitter(), {
		set value(value){
			vcas.forEach(vca => vca.gain.value = value);
			this.emit('change', value);
		},
		get value(){
			return vcas[0].gain.value;
		}
	});

	const attack = assign(new EventEmitter(), {
		set value(value){
			enveloppes.forEach(enveloppe => enveloppe.attack.value = scale(state.attack_range,value));
			this.emit('change', value);
		},
		get value(){
			return unscale(state.attack_range,enveloppes[0].attack.value);
		}
	});
	const decay = assign(new EventEmitter(), {
		set value(value){
			enveloppes.forEach(enveloppe => enveloppe.decay.value = value);
			this.emit('change', value);
		},
		get value(){
			return enveloppes[0].decay.value;
		}
	});
	const sustain = assign(new EventEmitter(), {
		set value(value){
			enveloppes.forEach(enveloppe => enveloppe.sustain.value = value);
			this.emit('change', value);
		},
		get value(){
			return enveloppes[0].sustain.value;
		}
	});
	const release = assign(new EventEmitter(), {
		set value(value){
			enveloppes.forEach(enveloppe => enveloppe.release.value = value);
			this.emit('change', value);
		},
		get value(){
			return enveloppes[0].release.value;
		}
	});



	return {
		connect({input}) {
			times(state.num_voices, i => {
				vcos[i].connect(vcas[i]);
				vcas[i].connect({input: channel_merger});
				enveloppes[i].connect({param:vcas[i].gain});
			});
			channel_merger.connect(input);
		},
		voiceOn(freq, time) {
			const voice = polyphony_manager.assign(freq);
			vcos[voice].gateOn(freq, time);
			enveloppes[voice].gateOn(time);
		},
		voiceOff(freq, time){
			const voice = polyphony_manager.unassign(freq);
			if(voice >= 0){
				enveloppes[voice].gateOff(time);
			}
		},
		get type(){
			return type;
		},
		get gain(){
			return gain;
		},
		get attack(){
			return  attack;

		},
		get decay(){
			return  decay;
		},
		get sustain(){
			return  sustain;

		},
		get release(){
			return release;
		}
	};
}

function create_polyphony_manager(num_voices){
	const freqs = new Array(num_voices);
	let index = 0;
	return {
		assign(freq) {
			index = ++index % freqs.length;
			freqs[index] = freq;
			return index;
		},
		unassign(freq) {
			return freqs.indexOf(freq);
		}
	}
}

export default(audio_context, {num_voices})=> {
	const state = {
		audio_context: audio_context,
		num_voices: num_voices || 4,
		attack_range: {
			min: 0,
			max: 1
		},
		decay_range: {
			min: 0,
			max: 1
		},
		sustain_range: {
			min: 0,
			max: 1
		},
		release_range: {
			min: 0,
			max: 1
		}
	};
	return create_polyphonic_generator(state);
}
