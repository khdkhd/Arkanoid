import synthFactory from 'sound/synth/factory';
import controlFactory from 'sound/controls/factory';
import is_nil from 'lodash.isnil';

function get_frequency_of_note(note, octave) {
	const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
	let key_index = notes.indexOf(note);
	key_index = key_index + ((octave - 1) * 12) + 1;
	return 440 * Math.pow(2, (key_index - 49) / 12);
}

export default function createSynth(audio_context) {
	const signal_generators = [];
	let synth_parts = [];
	const views = [];
	return {
		patch(patch) {
			synth_parts = patch.nodes.map(node => {
				const part = synthFactory[node.factory](audio_context, node.options);
				const config = node.config;
				Object.keys(config).forEach(param => {
					part[param].value = config[param].value;
					if(!is_nil(config[param].view)){
						console.log(config[param].view.factory);
						const view = controlFactory[config[param].view.factory](config[param].view.options);
						view.param = part[param];
						views.push(view);
					}
				});
				if(node.type === 'generator'){
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
		},
		render(screen){
			screen.brush = '#123';
			screen.clear();
			views.forEach(view => view.render(screen));
		}
	};
}
