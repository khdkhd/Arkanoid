const DURATIONS = {
	WHOLE	: 1,
	HALF 	: 1/2,
	QUARTER: 1/4,
	EIGHTH : 1/8
};

function create_note({note, octave, duration}){
	return {
		note: note,
		octave: octave,
		duration: DURATIONS[duration]
	};
}

export default {
	createNote: create_note,
	get DURATION_WHOLE(){
		return DURATIONS.DURATION_WHOLE;
	},
	get DURATION_HALF(){
		return DURATIONS.DURATION_HALF;
	},
	get DURATION_QUARTER(){
		return DURATIONS.DURATION_QUARTER;
	},
	get DURATION_EIGHTH(){
		return DURATIONS.DURATION_EIGHTH;
	}
}
