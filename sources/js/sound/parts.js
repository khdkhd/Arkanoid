import times from 'lodash.times';

const WAVEFORM_SINE = 'sine';
const WAVEFORM_TRIANGLE = 'triangle';
const WAVEFORM_SAWTOOTH = 'sawtooth';
const WAVEFORM_SQUARE = 'square';


const FILTER_LOWPASS = 'lowpass';
const FILTER_HIGHPASS = 'highpass';
const FILTER_BANDPASS = 'bandpass';
const FILTER_LOWSHELF = 'lowshelf';
const FILTER_HIGHSHELF = 'highshelf';
const FILTER_PEAKING = 'peaking';
const FILTER_NOTCH = 'notch';
const FILTER_ALLPASS = 'allpass';


function createMasterOutput(audio_context){
	const _input = audio_context.destination;
	return {
		get input(){
			return _input;
		}
	}
}

function createVCO(audio_context) {
	const osc = audio_context.createOscillator();
	return {
		connect({input}) {
			osc.connect(input);
			osc.start(0);
		},
		gateOn(freq, time) {
			osc.frequency.setValueAtTime(freq, time);
		},
		get form(){
			return osc.type;
		},
		set form(type) {
			osc.type = type;
		}
	};
}

function createVCA(audio_context) {
	const vca = audio_context.createGain();
	return {
		connect({input}) {
			vca.connect(input);
		},
		setValueAtTime(value, time) {
			vca.gain.setValueAtTime(value, time)
		},
		linearRampToValueAtTime(value, time) {
			vca.gain.linearRampToValueAtTime(value, time);
		},
		cancelScheduledValues(time){
			vca.gain.cancelScheduledValues(time);
		},
		get input() {
			return vca;
		},
		get gain(){
			return vca.gain;
		},
		set value(value){
			vca.gain.value = value;
		}
	};
}

function createPolyphonicGenerator(audio_context, {voices}) {
	const vcos = times(voices, () => createVCO(audio_context));
	const vcas = times(voices, () => createVCA(audio_context));
	const enveloppes = times(voices, () => createEnveloppeGenerator());
	const channel_merger = audio_context.createChannelMerger();
	const polyphonyManager = createPolyphonyManager(voices);
	return {
		connect({input}) {
			times(voices, i => {
				vcos[i].connect(vcas[i]);
				vcas[i].connect({input: channel_merger});
				enveloppes[i].connect({param:vcas[i].gain});
			});
			channel_merger.connect(input);
		},
		voiceOn(freq, time) {
			const voice = polyphonyManager.assign(freq);
			if(voice >= 0){
				vcos[voice].gateOn(freq, time);
				enveloppes[voice].gateOn(time);
			}
		},
		voiceOff(freq, time){
			const voice = polyphonyManager.unassign(freq);
			if(voice >= 0){
				enveloppes[voice].gateOff(time);
			}
		},
		get form(){
			return vcos[0].form;
		},
		set form(type) {
			vcos.forEach(vco => vco.form = type);
		},
		set attack(value){
			enveloppes.forEach(enveloppe => enveloppe.attack = value);
		},
		set decay(value){
			enveloppes.forEach(enveloppe => enveloppe.decay = value);
		},
		set sustain(value){
			enveloppes.forEach(enveloppe => enveloppe.sustain = value);
		},
		set gain(value){
			vcas.forEach(vca => vca.value = value);
		},
		set release(value){
			enveloppes.forEach(enveloppe => enveloppe.release = value);
		}
	};
}

function createPolyphonyManager(voices){
	const freqs = new Array(voices);
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

function createEnveloppeGenerator(){
	let attack = .0125, sustain = .25, decay =.00025, release = .0025;
	let _param;
	return {
		connect({param}){
			_param = param;
		},
		gateOn(time){
			_param.cancelScheduledValues(time);
			_param.setValueAtTime(0, time);
			_param.linearRampToValueAtTime(1, time + attack);
			_param.linearRampToValueAtTime(sustain, time + attack + decay);
		},
		gateOff(time){
			_param.cancelScheduledValues(time);
			_param.linearRampToValueAtTime(0, time + release);
		},
		set attack(value){
			attack = value;
		},
		set decay(value){
			decay = value;
		},
		set sustain(value){
			sustain = value;
		},
		set release(value){
			release = value;
		}
	};
}

function createBiquadFilter(audio_context){
	const filter = audio_context.createBiquadFilter();
	const enveloppe = createEnveloppeGenerator();
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
		},
		get frequency(){
			return filter.frequency;
		},
		set gain(value){
			filter.gain.value = value;
		},
		set attack(value){
			enveloppe.attack = value;
		},
		set decay(value){
			enveloppe.decay = value;
		},
		set sustain(value){
			enveloppe.sustain = value;
		},
		set release(value){
			enveloppe.release = value;
		},
	};
}

function createLFO(audio_context){
	const osc = audio_context.createOscillator();
	const gain = audio_context.createGain();
	return {
		connect({param}){
			osc.connect(gain);
			gain.connect(param);
			osc.start();
		},
		set frequency(value){
			osc.frequency.value = value;
		},
		set amplitude(value){
			gain.gain.value = value;
		},
		set form(type){
			osc.type = type;
		}
	};
}

export default  {
	vco: createVCO,
	vca: createVCA,
	biquad_filter: createBiquadFilter,
	enveloppe_generator: createEnveloppeGenerator,
	lfo: createLFO,
	polyphonic_generator: createPolyphonicGenerator,
	master: createMasterOutput,
	get WAVEFORM_SINE(){
		return WAVEFORM_SINE;
	},
	get WAVEFORM_SQUARE(){
		return WAVEFORM_SQUARE;
	},
	get WAVEFORM_TRIANGLE(){
		return WAVEFORM_TRIANGLE;
	},
	get WAVEFORM_SAWTOOTH(){
		return WAVEFORM_SAWTOOTH;
	},
	get FILTER_LOWPASS(){
		return FILTER_LOWPASS;
	},
	get FILTER_HIGHPASS(){
		return FILTER_HIGHPASS;
	},
	get FILTER_LOWSHELF(){
		return FILTER_LOWSHELF;
	},
	get FILTER_HIGHSHELF(){
		return FILTER_HIGHSHELF;
	},
	get FILTER_BANDPASS(){
		return FILTER_BANDPASS;
	},
	get FILTER_ALLPASS(){
		return FILTER_ALLPASS;
	},
	get FILTER_NOTCH(){
		return FILTER_NOTCH;
	},
	get FILTER_PEAKING(){
		return FILTER_PEAKING;
	}
};
