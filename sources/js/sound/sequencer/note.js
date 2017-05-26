import is_nil from 'lodash.isnil';

export const DURATIONS = {
	WHOLE	: 1,
	HALF 	: 1/2,
	QUARTER: 1/4,
	EIGHTH : 1/8
};

const Note = ({note, octave, duration})=> {
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

Note.getFrequency = (note, octave) => {
	const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	let key_index = notes.indexOf(note);
	key_index = key_index + ((octave - 1) * 12) + 1;
	return 440 * Math.pow(2, (key_index - 49) / 12);
}

export default Note
