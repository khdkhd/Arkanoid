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
	let attack = .01, sustain = .8, decay =.2, release = .1;
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
			param.setValueAtTime(param.value, time);
			param.linearRampToValueAtTime(0.0001, time + release);
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

function createMoogFilter(audio_context) {
	const bufferSize = 4096;
	const node = audio_context.createScriptProcessor(bufferSize, 1, 1);
	let in1, in2, in3, in4, out1, out2, out3, out4;
	in1 = in2 = in3 = in4 = out1 = out2 = out3 = out4 = 0.0;
	node.cutoff = .85; // between 0.0 and 1.0
	node.resonance = 2.99; // between 0.0 and 4.0
	node.onaudioprocess = function(e) {
		const input = e.inputBuffer.getChannelData(0);
		const output = e.outputBuffer.getChannelData(0);
		const f = node.cutoff * 1.16;
		const fb = node.resonance * (1.0 - 0.15 * f * f);
		for (let i = 0; i < bufferSize; i++) {
			input[i] -= out4 * fb;
			input[i] *= 0.35013 * (f * f) * (f * f);
			out1 = input[i] + 0.3 * in1 + (1 - f) * out1; // Pole 1
			in1 = input[i];
			out2 = out1 + 0.3 * in2 + (1 - f) * out2; // Pole 2
			in2 = out1;
			out3 = out2 + 0.3 * in3 + (1 - f) * out3; // Pole 3
			in3 = out2;
			out4 = out3 + 0.3 * in4 + (1 - f) * out4; // Pole 4
			in4 = out3;
			output[i] = out4;
		}
	}
	return {
		connect({input}){
			node.connect(input);
		},
		get input(){
			return node;
		},
		set frequency(value){
			return node.cutoff = value;
		},
		set resonance(value){
			node.resonance = value;
		},
		get cutoff(){
			return node.cutoff;
		}
	}
}

function createLFO(audio_context){
	const osc = audio_context.createOscillator();
	const gain = audio_context.createGain();
	return {
		connect({input}){
			osc.connect(gain);
			gain.connect(input);
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
	let time = audio_context.currentTime;
	return {
		playSequence({notes, duration}){
			for(let i = 0; i<notes.length *3; i++){
				slave.noteOn(0,{note:notes[Math.ceil(Math.random()*notes.length)], octave: 4}, time);
				slave.noteOn(1,{note:notes[Math.ceil(Math.random()*notes.length)], octave: 5}, time);
				time += duration;
				slave.noteOff(0, time);
				slave.noteOff(1, time);
			}
		},
	};
}

function createSynth(audio_context) {
	const filter = createMoogFilter(audio_context);
	const vca = createVCA(audio_context);
	const master = createMasterOutput(audio_context);
	const voices = createPolyphony(audio_context,2);
	return {
		patch() {
			voices.waveForm = 'square';
			filter.frequency = .9;
			filter.resonance = 2;
			voices.connect(filter);
			filter.connect(master);
			filter.connect(vca);
			vca.connect(master);
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
