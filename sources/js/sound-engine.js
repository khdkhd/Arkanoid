import times from 'lodash.times';

function get_frequency_of_note({
	note,
	octave
}) {
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
	return {
		connect({input}) {
			osc.connect(input);
			osc.start(0);
		},
		gateOn(freq, time) {
			osc.frequency.setValueAtTime(freq, time);
		},
		set waveForm(type) {
			osc.type = type;
		}
	};
}


function createPolyphony(audio_context, voices) {
	const vcos = times(voices, () => createVCO(audio_context));
	const vcas = times(voices, () => createVCA(audio_context));
	const enveloppes = times(voices, () => createEnveloppeGenerator());
	const channel_merger = audio_context.createChannelMerger();
	return {
		connect({input}) {
			times(voices, i => {
				vcos[i].connect(vcas[i]);
				vcas[i].connect({input: channel_merger});
				enveloppes[i].connect({input:vcas[i].gain});
			});
			channel_merger.connect(input);
		},
		voiceOn(voice, freq, time) {
			vcos[voice].gateOn(freq, time);
			enveloppes[voice].gateOn(time);
		},
		voiceOff(voice, time){
			enveloppes[voice].gateOff(time);
		},
		set waveForm(type) {
			vcos.forEach(vco => vco.waveForm = type);
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
		},

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
	const types = [
			'lowpass',
			'highpass',
			'bandpass',
			'lowshelf',
			'highshelf',
			'peaking',
			'notch',
			'allpass'
	];
	filter.type = types[3];
	return {
		connect({input}){
			filter.connect(input);
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
		}
	};
}

function createLFO(audio_context){
	const osc = audio_context.createOscillator();
	const gain = audio_context.createGain();
	osc.type = 'sawtooth';
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
		set waveForm(type){
			osc.type = type;
		}
	};
}

function createSequencer(slave, audio_context){
	return {
		playSequence({notes, duration}){
			let time = audio_context.currentTime;
			for(let i = 0; i<notes.length; i++){
				slave.noteOn(0,{note:notes[i], octave: 4}, time);
				slave.noteOn(1,{note:notes[notes.length-1], octave: 2}, time/2);
				time += duration;
				slave.noteOff(0, time);
				slave.noteOff(1, time);
			}
		},
		playNote(note, octave, duration){
			const time = audio_context.currentTime;
			slave.noteOn(0,{note:note, octave: octave}, time);
			slave.noteOff(0, time + duration);
		}
	};
}

function createSynth(audio_context) {
	const filter = createBiquadFilter(audio_context);
	const master = createMasterOutput(audio_context);
	const voices = createPolyphony(audio_context, 2);
	const lfo = createLFO(audio_context);
	return {
		patch() {
			voices.waveForm = 'square';
			voices.release = .5;
			filter.frequency = 50;
			filter.gain = 55;
			voices.connect(filter);
			filter.connect(master);
			lfo.connect({input:filter.frequency});
			lfo.frequency = 300;
			lfo.waveForm = 'triangle';
			lfo.amplitude = 15;
		},
		noteOn(voice, {note, octave}, time) {
			voices.voiceOn(voice, get_frequency_of_note({note, octave}), time);
		},
		noteOff(voice, time){
			voices.voiceOff(voice, time);
		}
	};
}

export { createSynth, createSequencer };
