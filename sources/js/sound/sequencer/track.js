import Note from 'sound/sequencer/note';

function get_col(grid, col){
	return grid.map(row => row[col]);
}

function create_track(state){

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
		state.slave.noteOn(note, octave, time);
		state.slave.noteOff(note, octave, time + duration * grid.length);
	}

	return {
		set grid(matrix2d){
			grid = matrix2d.map(row =>
				row.map(step => {
					if(step.note){
						return Note.createNote(step);
					}
					return {};
			}));
		},
		schedule(time){
			pos = ++pos % grid[0].length;
			playNotes(get_col(grid, pos).map(step=>Object.assign({time:time},step)));
		},
		assign(slave){
			state.slave = slave;
		}
	};

}

export default slave => {
	const state = {
		slave: slave
	};
	return create_track(state);
}
