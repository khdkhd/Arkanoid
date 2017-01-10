import Note from 'sound/sequencer/note';
import is_nil from 'lodash.isnil';

function get_col(grid, col){
	return grid.map(row => row[col]);
}

function create_track(state){

	function playNotes(notes){
		notes.forEach(note=>{
			if(note.note){
				playNote(note);
			}
		});
	}

	function playNote({note, octave, time, duration}){
		if(is_nil(state.slave)){
			return;
		}
		state.slave.noteOn(note, octave, time);
		state.slave.noteOff(note, octave, time + duration * 60 / state.tempo);
	}

	return {
		set grid(matrix2d){
			state.grid = matrix2d.map(row =>
				row.map(step => {
					if(step.note){
						return Note.createNote(step);
					}
					return {};
			}));
		},
		schedule(time){
			state.pos = ++state.pos % state.grid[0].length;
			playNotes(get_col(state.grid, state.pos).map(step=>Object.assign({time:time},step)));
		},
		assign(slave){
			state.slave = slave;
		}
	};

}

export default state => {
	const _state = Object.assign({}, state, {
		slave: null,
		pos: 0,
		grid: [[{}]]
	});
	return create_track(_state);
}
