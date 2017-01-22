import create_note from 'sound/sequencer/note';
import is_nil from 'lodash.isnil';

function get_col(grid, col){
	return grid.map(row => row[col]);
}

export default ({tempo, slave}) => {

	let _slave = slave;
	let grid = [[{}]];
	let pos = 0;

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
				_slave.noteOn(note, octave, time);
				_slave.noteOff(note, octave, time + duration * 60 / tempo);
			}

			return {
				set grid(matrix2d){
					grid = matrix2d.map(row =>
						row.map(create_note));
				},
				schedule(time){
					pos = ++pos % grid[0].length;
					playNotes(get_col(grid, pos).map(step=>Object.assign({time:time},step)));
				},
				loop(){

				},
				assign(slave){
					_slave = slave;
				},
				rewind(){
					pos = 0;
				}
			};
}
