import mono from 'sound/synth/mono';
import Model  from 'sound/common/model';

export default({audio_context}) => {

	const state = {
		voices: {

		},
		type: Model({
			init(){
				return 'square'
			}
		}),
		input: audio_context.createChannelMerger()
	}


	return {
		connect({input, connect}){
			state.input.connect(input);
			return {connect};
		},
		noteOn(freq, time) {
			if(!state.voices[freq]){
				const voice = mono({audio_context});
				voice.getType().value = state.type.value;
				voice.noteOn(freq, time);
				voice.connect({input: state.input});
				state.voices[freq] = voice;
			}

		},
		noteOff(freq, time) {
			if(state.voices[freq]){
				state.voices[freq].noteOff(null, time);
				delete state.voices[freq];
			}
		},
		stop(){
			Object.values(state.voices).forEach(voice => voice.noteOff(null, 0))
		},
		get envIn(){
			return Object.values(state.voices).map(voice => voice.envIn);
		},
		getType(){
			return state.type;
		},
		setType(value){
			state.type.value = value;
			return this;
		}
	}
}
