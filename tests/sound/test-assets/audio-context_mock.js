import sinon from 'sinon';

const audio_param = {
	setValueAtTime(){

	},
	cancelScheduledValues(){

	},
	linearRampToValueAtTime(){

	},
	set value(value){

	},
	get value(){

	}
}

function create_gain() {
	return {
		gain: Object.create(audio_param),
		connect(){

		}
	}
}

function create_oscillator() {
	return {
		get frequency() {
			return Object.create(audio_param);
		},
		connect(){

		},
		start(){

		}
	}
}

function create_channel_merger(){
	return {
		connect(){

		}
	}
}

const audio_context_methods = {
	createOscillator(){
		return create_oscillator();
	},
	createGain(){
		return create_gain()
	},
	createBiquadFilter(){

	},
	createChannelMerger() {
		return create_channel_merger();
	}
};

for(let method of Object.keys(audio_context_methods)){
	sinon.spy(audio_context_methods, method);
}

audio_context_methods.reset = function() {
	for(let [, method] of Object.entries(audio_context_methods)){
		sinon.spy.reset.call(method);
	}
};

export default () => {
	return Object.create(audio_context_methods);
};
