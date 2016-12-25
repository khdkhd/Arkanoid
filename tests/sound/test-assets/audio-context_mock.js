import sinon from 'sinon';

const create_gain = () => {
	return {
		gain: {
			set value(value){

			},
			get value(){

			}
		}
	}
};

const audio_context_methods = {
	createOscillator(){

	},
	createGain(){
		return create_gain()
	},
	createBiquadFilter(){

	},
	createChannelMerger() {
	}
};

for(let method in audio_context_methods){
	sinon.spy(audio_context_methods, method);
}

audio_context_methods.reset = () => {
	for(let method in audio_context_methods){
		sinon.spy.reset.call(audio_context_methods[method]);
	}
};

export default () => {
	return Object.create(audio_context_methods);
};
