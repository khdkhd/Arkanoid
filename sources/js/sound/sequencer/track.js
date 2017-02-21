import create_note from 'sound/sequencer/note';
import is_nil from 'lodash.isnil';
import times from 'lodash.times';

export default ({tempo, slave, pos}) => {

	let _slave = slave;
	let grid = times(16, () => []);

	function playNotes(notes){
		notes.forEach(note=>{
				playNote(note);
		});
	}

	function playNote({note, octave, time, duration}){
		if(is_nil(_slave)) {
			return;
		}
		_slave.noteOn(note, octave, time);
		_slave.noteOff(note, octave, time + duration * 60 / tempo.value);
	}

	return {
			set partition(matrix2d){
				grid = matrix2d.map(notes =>
					notes.map(create_note));
			},
			get partition(){
				return grid;
			},
			schedule(time){
				playNotes(grid[pos.value].map(step => Object.assign({time}, step)));
			},
			assign(slave){
				_slave = slave;
			}
		};
	}
