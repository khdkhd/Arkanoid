import is_nil from 'lodash.isnil';

export default ({slave } = {}) => {

	let _slave;

	if(!is_nil(slave)){
		_slave = slave;
	}

	return {
		assign(slave){
			_slave = slave;
		},
		playNote(time, {note, octave, duration}){
			_slave.noteOn(note, octave, time);
			_slave.noteOff(note, octave, time + duration);
		},
		arpegiate(time, interval, notes) {
			for(let note of notes){
				_slave.noteOn(note.note, note.octave, time);
				_slave.noteOff(note.note, note.octave, time + note.duration);
				time += interval;
			}
		}
	};
}
