import Part from 'sound/parts';

function get_frequency_of_note(note, octave) {
	const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
	let key_index = notes.indexOf(note);
	key_index = key_index + ((octave - 1) * 12) + 1;
	return 440 * Math.pow(2, (key_index - 49) / 12);
}

export default function createSynth(audio_context) {
	const signal_generators = [];
	return {
		patch(patch) {
			const synth_parts = patch.nodes.map(function(synth_part){
				const part = Object.assign(Part[synth_part.factory](audio_context, synth_part.options), synth_part.config);
				if(synth_part.type == 'generator'){
					signal_generators.push(part);
				}
				return part;
			});
			for(let con of patch.connexions){
				synth_parts[con[0]].connect(synth_parts[con[1]]);
			}
		},
		noteOn(note, octave, time) {
			signal_generators.forEach(function(generator){
				generator.voiceOn(get_frequency_of_note(note, octave), time);
			});
		},
		noteOff(note, octave, time){
			signal_generators.forEach(function(generator){
				generator.voiceOff(get_frequency_of_note(note, octave), time);
			});
		}
	};
}
