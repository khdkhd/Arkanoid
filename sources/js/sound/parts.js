import times from 'lodash.times';

const WAVEFORM = {
	SINE: 'sine',
	TRIANGLE: 'triangle',
	SAWTOOTH: 'sawtooth',
	SQUARE: 'square'
};

const FILTER = {
	LOWPASS: 'lowpass',
	HIGHPASS: 'highpass',
	BANDPASS: 'bandpass',
	LOWSHELF: 'lowshelf',
	HIGHSHELF: 'highshelf',
	PEAKING: 'peaking',
	NOTCH: 'notch',
	ALLPASS: 'allpass'
};

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
	osc.type = WAVEFORM.TRIANGLE;
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
	vca.gain.value = 0.0001;
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
	};
}

function createPolyphonicGenerator(audio_context, options) {
	const voices = options.voices;
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
			if(!isNaN(voice)){
				vcos[voice].gateOn(freq, time);
				enveloppes[voice].gateOn(time);
			}
		},
		voiceOff(freq, time){
			const voice = polyphonyManager.unassign(freq);
			if(!isNaN(voice)){
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
		set release(value){
			enveloppes.forEach(enveloppe => enveloppe.release = value);
		}
	};
}

function createPolyphonyManager(voices){
	const freqs = new Array(voices).fill(-1);
	return {
		assign(freq) {
			let index;
			freqs.some(function(elem, i, freqs) {
				if (elem < 0) {
					index = i;
					freqs[i] = freq;
					return true;
				}
			});
			return index;
		},
		unassign(freq) {
			let index;
			freqs.some(function(elem, i, freqs) {
				if (elem == freq) {
					freqs[i] = -1;
					index = i;
					return true;
				}
			});
			return index;
		}
	};
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
	filter.type = FILTER.LOWSHELF;
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
	osc.type = WAVEFORM.SAWTOOTH;
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
	master: createMasterOutput
};
