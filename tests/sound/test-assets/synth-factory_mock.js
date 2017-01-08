import factory from 'sound/synth/factory';

function create_synth_factory(sandbox) {

	const factory_functions = {

		biquad_filter(audio_context){
			return factory.biquad_filter(audio_context);
		},
		enveloppe_generator(){
			return factory.enveloppe_generator()
		},
		lfo(audio_context){
			return factory.lfo(audio_context);
		},
		polyphonic_generator(audio_context, {num_voices, factory}){
			return factory.polyphonic_generator(audio_context, {num_voices, factory});
		},
		polyphony_manager({num_voices}){
			return factory.polyphony_manager({num_voices});
		},
		master(audio_context){
			return factory.master(audio_context);
		},
		vco(audio_context){
			return factory.vco(audio_context);
		},
		vca(audio_context){
			return factory.vca(audio_context);
		}
	};

	for(let func of Object.keys(factory_functions)){
		sandbox.spy(factory_functions, func);
	}

	return Object.assign({}, factory_functions);

}

export default sandbox => create_synth_factory(sandbox);
