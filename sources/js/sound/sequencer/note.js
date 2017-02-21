import is_nil from 'lodash.isnil';

export const DURATIONS = {
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
		get note(){
			return note;
		},
		get octave(){
			return octave;
		},
		get duration(){
			return DURATIONS[duration] || duration;
		}
	};
}
