import is_nil from 'lodash.isnil';

const DURATIONS = {
	WHOLE	: 1,
	HALF 	: 1/2,
	QUARTER: 1/4,
	EIGHTH : 1/8
};

export default({note, octave, duration})=> {
	if(is_nil(note)){
		return {};
	}
	return {
		note: note,
		octave: octave,
		duration: DURATIONS[duration]
	};
}
