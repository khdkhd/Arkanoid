import times from 'lodash.times';
import EventEmitter from 'events';
import { scale, unscale } from 'sound/common/utils';
import { completeAssign as assign } from 'common/utils';

function create_polyphonic_generator(state) {

	const vcos = times(state.num_voices, () => state.factory['vco'](state.audio_context));
	const vcas = times(state.num_voices, () => state.factory['vca'](state.audio_context));
	const enveloppes = times(state.num_voices, () => state.factory['enveloppe_generator']());
	const channel_merger = state.audio_context.createChannelMerger(state.num_voices);
	const main_vca = state.factory['vca'](state.audio_context);
	const polyphony_manager = state.factory.polyphony_manager({num_voices: state.num_voices});

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
			main_vca.gain.value = value;
			this.emit('change', value);
		},
		get value(){
			return main_vca.gain.value;
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
			enveloppes.forEach(enveloppe => enveloppe.decay.value = scale(state.decay_range,value));
			this.emit('change', value);
		},
		get value(){
			return unscale(state.decay_range, enveloppes[0].decay.value);
		}
	});

	const sustain = assign(new EventEmitter(), {
		set value(value){
			enveloppes.forEach(enveloppe => enveloppe.sustain.value = scale(state.sustain_range, value));
			this.emit('change', value);
		},
		get value(){
			return unscale(state.sustain_range, enveloppes[0].sustain.value);
		}
	});

	const release = assign(new EventEmitter(), {
		set value(value){
			enveloppes.forEach(enveloppe => enveloppe.release.value = scale(state.release_range, value));
			this.emit('change', value);
		},
		get value(){
			return unscale(state.release_range,enveloppes[0].release.value);
		}
	});

	return {
		connect({input}) {
			times(state.num_voices, i => {
				vcos[i].connect(vcas[i]);
				vcas[i].connect({input: channel_merger});
				enveloppes[i].connect({param:vcas[i].gain});
			});
			channel_merger.connect(main_vca.input);
			main_vca.connect({input});
		},
		noteOn(freq, time) {
			const voice = polyphony_manager.assign(freq);
			vcos[voice].noteOn(freq, time);
			enveloppes[voice].gateOn(time);
		},
		noteOff(freq, time){
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

export default(audio_context, {num_voices, factory})=> {
	const state = {
		audio_context: audio_context,
		factory: factory,
		num_voices: num_voices || 4,
		attack_range: {
			min: 0,
			max: 0.1
		},
		decay_range: {
			min: 0,
			max: 0.2
		},
		sustain_range: {
			min: 0,
			max: 1
		},
		release_range: {
			min: 0,
			max: 5
		}
	};
	return create_polyphonic_generator(state);
}
