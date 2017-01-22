import times from 'lodash.times';
import { create_audio_model } from 'sound/common/utils';

export default({audio_context, num_voices = 4, factory})=> {

	const vcos = times(num_voices, () => factory['vco']({audio_context}));
	const vcas = times(num_voices, () => factory['vca']({audio_context}));
	const enveloppes = times(num_voices, () => factory['enveloppe_generator']());
	const channel_merger = audio_context.createChannelMerger(num_voices);
	const main_vca = factory['vca']({audio_context});
	const polyphony_manager = factory.polyphony_manager({num_voices: num_voices});

	const type = create_audio_model({
		param: {
			get value(){
				return vcos[0].type;
			},
			set value(value){
				vcos.forEach(vco => vco.type.value = value);
			}
		}
	});

	const gain = create_audio_model({
		param: main_vca.gain,
		range: {
			min: 0,
			max: 1
		}
	});

	const attack = create_audio_model({
		param: {
			set value(value){
				enveloppes.forEach(enveloppe => enveloppe.attack.value = value);
			},
			get value(){
				return enveloppes[0].attack.value;
			}
		},
		range: {
			min: 0,
			max: 1
		}
	});

	const decay = create_audio_model({
		param: {
			set value(value){
				enveloppes.forEach(enveloppe => enveloppe.decay.value = value);
			},
			get value(){
				return enveloppes[0].decay.value;
			}
		},
		range: {
			min: 0,
			max: 2
		}
	});

	const sustain = create_audio_model({
		param: {
			set value(value){
				enveloppes.forEach(enveloppe => enveloppe.sustain.value = value);
			},
			get value(){
				return enveloppes[0].sustain.value;
			}
		},
		range: {
			min: 0,
			max: 1
		}
	});

	const release = create_audio_model({
		param: {
			set value(value){
				enveloppes.forEach(enveloppe => enveloppe.release.value = value);
			},
			get value(){
				return enveloppes[0].release.value;
			}
		},
		range: {
			min: 0,
			max: 3
		}
	});

	return {
		connect({input}) {
			times(num_voices, i => {
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
