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
	let mods = [];
	const views = [];
	return {
		patch(patch) {
			mods = patch.nodes.reduce((mods, node)=> {
				const options = Object.assign({}, node.options)
				options.factory = synthFactory;
				mods[node.id] = synthFactory[node.factory](audio_context, options);
				const config = node.config;
				Object.keys(config).forEach(param => {
					mods[node.id][param].value = config[param].value;
					if(!is_nil(config[param].views)){
						config[param].views.forEach(view_def =>{
							const view = controlFactory[view_def.factory](view_def.options);
							view.param = mods[node.id][param];
							views.push(view);
						});
					}
				});
				if(node.voice){
					signal_generators.push(mods[node.id]);
				}
				return mods;
			}, {});
			for(let con of patch.connexions){
				mods[con[0]].connect(mods[con[1]]);
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
