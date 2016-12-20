import polyphonic_generator from 'sound/synth/polyphonic-generator';
import enveloppe_generator from 'sound/synth/enveloppe-generator';
import biquad_filter from 'sound/synth/biquad-filter';
import master_output from 'sound/synth/master-output';
import lfo from 'sound/synth/lfo';
import vco from 'sound/synth/vco';
import vca from 'sound/synth/vca';

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

export default  {
	biquad_filter: biquad_filter,
	enveloppe_generator: enveloppe_generator,
	lfo: lfo,
	polyphonic_generator: polyphonic_generator,
	master: master_output,
	vco: vco,
	vca: vca,
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
