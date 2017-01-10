import is_nil from 'lodash.isnil';

function create_keyboard(state){
	return {
		assign(slave){
			state.slave = slave;
		},
		play({note, octave, duration}){
			if(is_nil(state.slave)){
				return;
			}
			state.slave.noteOn(note, octave, 0);
			state.slave.noteOff(note, octave, duration);
		}
	};
}

export default () => {
	const state = {
		slave: null
	};

	return create_keyboard(state);
}
