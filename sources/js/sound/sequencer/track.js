import create_note from 'sound/sequencer/note';
import is_nil from 'lodash.isnil';

function get_col(grid, col){
	return grid.map(row => row[col]);
}

export default ({tempo, slave, pos}) => {

	let _slave = slave;
	let grid = [[{}]];

	function playNotes(notes){
		notes.forEach(note=>{
			if(note.note){
				playNote(note);
			}
		});
	}

	function playNote({note, octave, time, duration}){
		if(is_nil(_slave)){
			return;
		}
		console.log('noteOn',note, octave, time);
		_slave.noteOn(note, octave, time);
		console.log('noteOff',note, octave, time + duration * 60 / tempo.value);
		_slave.noteOff(note, octave, time + duration * 60 / tempo.value);
	}

	return {
		set partition(matrix2d){
			grid = matrix2d.map(row =>
				row.map(create_note));
			},
			schedule(time){
				playNotes(get_col(grid, pos.value).map(step=>Object.assign({time:time},step)));
			},
			loop(){

			},
			assign(slave){
				_slave = slave;
			}
		};
	}
