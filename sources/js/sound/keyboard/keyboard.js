function create_keyboard(state){
	return {
		assign(slave){
			state.slave = slave;
		},
		playNote(time, {note, octave, duration}){
			state.slave.noteOn(note, octave, time);
			state.slave.noteOff(note, octave, time + duration);
		},
		arpegiate(time, interval, ...notes) {
			for(let note of notes){
				state.slave.noteOn(note.note, note.octave, time);
				state.slave.noteOff(note.note, note.octave, time + note.duration);
				time+= interval;
			}
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
