export default({num_voices}) => {
	const freqs = new Array(num_voices);
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
