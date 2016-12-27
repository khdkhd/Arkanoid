import polyphony_manager from 'sound/synth/polyphony-manager';
import enveloppe_generator from 'sound/synth/enveloppe-generator';
import vco from 'sound/synth/vco';
import vca from 'sound/synth/vca';
import sinon from 'sinon';


const sandbox = sinon.sandbox.create();
let polyphony_manager_ref = null;

const factory_functions = {
	biquad_filter(){

	},
	enveloppe_generator(){
		return enveloppe_generator()
	},
	lfo(){

	},
	polyphonic_generator(){

	},
	polyphony_manager({num_voices}){
		polyphony_manager_ref = polyphony_manager({num_voices});
		sinon.spy(polyphony_manager_ref, 'assign');
		sinon.spy(polyphony_manager_ref, 'unassign');
		return polyphony_manager_ref;
	},
	master(){

	},
	vco(audio_context){
		return vco(audio_context);
	},
	vca(audio_context){
		return vca(audio_context);
	},
	getPolyphonyManager(){
		return polyphony_manager_ref;
	}
};

for(let factory of Object.keys(factory_functions)){
	sandbox.spy(factory_functions, factory);
}

factory_functions.reset = function(){
	for(let [, factory] of Object.entries(factory_functions)){
		sinon.spy.reset.call(factory);
	}
}

export default() => {
	return Object.create(factory_functions);
}
