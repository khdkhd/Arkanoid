import mono from 'sound/synth/mono';
import Model  from 'sound/common/model';
import is_nil from 'lodash.isnil';

export default({audio_context}) => {

	const state = {
		voices: {},
		monos: [],
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
		noteOn(freq, time, velocity) {
			if(is_nil(state.voices[freq])){
				const voice = mono({audio_context});
				voice.getType().value = state.type.value;
				voice.connect({input: state.input});
				voice.noteOn(freq, time, velocity);
				state.voices[freq] = voice;
				state.monos.push(voice)
			}

		},
		noteOff(freq, time) {
			if(!is_nil(state.voices[freq])){
				state.voices[freq].noteOff(null, time);
				delete state.voices[freq];
			}
		},
		stop(time=0){
			// Object.values(state.voices).forEach(voice => voice.stop())
			state.monos = state.monos.reduce((a,i)=> {
				i.stop(time)
				return a
			}, [])
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
