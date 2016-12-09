import synthFactory from 'sound/synth/factory';

function get_frequency_of_note(note, octave) {
	const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
	let key_index = notes.indexOf(note);
	key_index = key_index + ((octave - 1) * 12) + 1;
	return 440 * Math.pow(2, (key_index - 49) / 12);
}

export default function createSynth(audio_context) {
	const signal_generators = [];
	let synth_parts = [];
	return {
		patch(patch) {
			synth_parts = patch.nodes.map(node => {
				console.log(node);
				const part = Object.assign(synthFactory[node.factory](audio_context, node.options));
				Object.keys(node.config).forEach(param => {
					console.log('param',param);
					console.log(node.config[param]);
					console.log(part[param]);
					part[param].value = node.config[param].value
				});
				if(node.type === 'generator'){
					signal_generators.push(part);
				}
				return part;
			});
			console.log(synth_parts);
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
		},
		get synth_parts(){
			return synth_parts;
		}
	};
}
