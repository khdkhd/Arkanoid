function scale(range, value){
	return (range.max-range.min) * value + range.min;
}

function unscale(range, value){
	return (value-range.min)/(range.max-range.min);
}

function get_frequency_of_note(note, octave) {
	const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
	let key_index = notes.indexOf(note);
	key_index = key_index + ((octave - 1) * 12) + 1;
	return 440 * Math.pow(2, (key_index - 49) / 12);
}

export {
	scale,
	unscale,
	get_frequency_of_note
};
