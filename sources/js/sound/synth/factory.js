import polyphonic_generator from 'sound/synth/polyphonic-generator';
import enveloppe_generator from 'sound/synth/enveloppe-generator';
import polyphony_manager from 'sound/synth/polyphony-manager';
import biquad_filter from 'sound/synth/biquad-filter';
import master_output from 'sound/synth/master-output';
import lfo from 'sound/synth/lfo';
import vco from 'sound/synth/vco';
import vca from 'sound/synth/vca';

export default  {
	biquad_filter: biquad_filter,
	enveloppe_generator: enveloppe_generator,
	lfo: lfo,
	polyphonic_generator: polyphonic_generator,
	polyphony_manager: polyphony_manager,
	master: master_output,
	vco: vco,
	vca: vca
};
