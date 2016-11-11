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

const FACTORIES = {
	vco: createVCO,
	vca: createVCA,
	biquad_filter: createBiquadFilter,
	enveloppe_generator: createEnveloppeGenerator,
	lfo: createLFO,
	polyphonic_generator: createPolyphonicGenerator,
	master: createMasterOutput
};

function get_frequency_of_note({note, octave}) {
	const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
	let key_index = notes.indexOf(note);
	key_index = key_index + ((octave - 1) * 12) + 1;
	return 440 * Math.pow(2, (key_index - 49) / 12);
}

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
				enveloppes[i].connect({input:vcas[i].gain});
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
	let param;
	return {
		connect({input}){
			param = input;
		},
		gateOn(time){
			param.cancelScheduledValues(time);
			param.setValueAtTime(0, time);
			param.linearRampToValueAtTime(1, time + attack);
			param.linearRampToValueAtTime(sustain, time + attack + decay);
		},
		gateOff(time){
			param.cancelScheduledValues(time);
			param.linearRampToValueAtTime(0, time + release);
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
		connect({input}){
			osc.connect(gain);
			gain.connect(input);
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

function createSequencer(audio_context, options){
	const slave = options.slave;
	return {
		playSequence({notes, duration}){
			let time = audio_context.currentTime;
			for(let i = 0; i<notes.length; i++){
				slave.noteOn({note:notes[i], octave: 4}, time);
				slave.noteOn({note:notes[notes.length-1], octave: 4}, time/2);
				time += duration;
				slave.noteOff({note:notes[i], octave: 4}, time);
				slave.noteOff({note:notes[notes.length-1], octave: 4}, time);
			}
		},
		playNote(note, octave, duration){
			const time = audio_context.currentTime;
			slave.noteOn({note:note, octave: octave}, time);
			slave.noteOff({note:note, octave: octave}, time + duration);
		}
	};
}

function createSynth(audio_context) {
	const signal_generators = [];
	return {
		patch(patch) {
			const synth_parts = patch.nodes.map(function(synth_part){
				const part = Object.assign(FACTORIES[synth_part.type](audio_context, synth_part.options), synth_part.config);
				if(synth_part.generator){
					signal_generators.push(part);
				}
				return part;
			});
			for(let con of patch.connexions){
				synth_parts[con[0]].connect(synth_parts[con[1]]);
			}
		},
		noteOn({note, octave}, time) {
			signal_generators.forEach(function(generator){
				generator.voiceOn(get_frequency_of_note({note, octave}), time);

			});
		},
		noteOff({note, octave}, time){
			signal_generators.forEach(function(generator){
				generator.voiceOff(get_frequency_of_note({note, octave}), time);
			});
		}
	};
}




export { createSynth, createSequencer };
