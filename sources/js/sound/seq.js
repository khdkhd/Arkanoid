export default function createSequencer(audio_context, {slave}){
	let grid = [[{}]];
	let [tempo, time, pos] = [120,0,0];

	function tick(){
		return tempo / (60 * grid[0].length);
	}

	function get_col(grid, col){
		return grid.map(row => row[col]);
	}

	function playNotes(notes){
		notes.forEach(note=>{
			if(note.note){
				playNote(note);
			}
		});
	}

	function playNote({note, octave, time, duration}){
		slave.noteOn(note, octave, time);
		slave.noteOff(note, octave, time + duration * grid.length);
	}

	return {
		start() {
			time = audio_context.currentTime;
		},
		play(){
			if(time + tick() >= audio_context.currentTime){
				time += tick();
				pos = ++pos % grid[0].length;
				playNotes(get_col(grid, pos).map(step=>Object.assign({time:time},step)));
			}
		},
		set tempo(value){
			tempo = value;
		},
		set grid(matrix2d){
			grid = matrix2d;
		}
	};
}
