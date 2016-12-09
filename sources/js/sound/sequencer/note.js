const DURATIONS = {
	DURATION_WHOLE	: 1,
	DURATION_HALF 	: 1/2,
	DURATION_QUARTER: 1/4,
	DURATION_EIGHTH : 1/8
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
