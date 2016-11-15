const DURATION_WHOLE = 1;
const DURATION_HALF = 1/2;
const DURATION_QUARTER = 1/4;
const DURATION_EIGHTH = 1/8;

function createNote(note, octave, duration){
	return {
		note: note,
		octave: octave,
		duration: duration
	};
}

export default {
	note: createNote,
	get DURATION_WHOLE(){
		return DURATION_WHOLE;
	},
	get DURATION_HALF(){
		return DURATION_HALF;
	},
	get DURATION_QUARTER(){
		return DURATION_QUARTER;
	},
	get DURATION_EIGHTH(){
		return DURATION_EIGHTH;
	}
}
