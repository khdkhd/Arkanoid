function create_polyphony_manager(state) {
	const freqs = new Array(state.num_voices);
	let index = 0;
	return {
		assign(freq) {
			index = ++index % freqs.length;
			freqs[index] = freq;
			return index;
		},
		unassign(freq) {
			return freqs.indexOf(freq);
		}
	}
}

export default({num_voices}) => {
	const state = {
		num_voices: num_voices
	};
	return create_polyphony_manager(state);
}
