import is_nil from 'lodash.isnil';

function create_keyboard(state){
	return {
		assign(slave){
			state.slave = slave;
		},
		playNote({note, octave, duration}){
			if(is_nil(state.slave)){
				return;
			}
			const time = state.audio_context.currentTime;
			state.slave.noteOn(note, octave, time);
			state.slave.noteOff(note, octave, time + duration);
		}
	};
}

export default audio_context => {
	const state = {
		audio_context: audio_context,
		slave: null
	};

	return create_keyboard(state);
}
