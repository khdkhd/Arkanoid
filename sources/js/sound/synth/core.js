import synthFactory from 'sound/synth/factory';
import controlFactory from 'sound/controls/factory';
import is_nil from 'lodash.isnil';
import {get_frequency_of_note } from 'sound/common/utils';

export default ({audio_context})  => {
		const voices = [];
		const views = [];
		let output, mods;
		return {
			patch(patch) {
				mods = patch.nodes.reduce((mods, node)=> {
					const options = Object.assign({}, node.options)
					options.factory = synthFactory;
					mods[node.id] = options.factory[node.factory](Object.assign({audio_context}, options));
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
						voices.push(mods[node.id]);
					}
					if(node.output){
						output = mods[node.id];
					}
					return mods;
				}, {});
				for(let con of patch.connexions){
					mods[con[0]].connect(mods[con[1]]);
				}
			},
			noteOn(note, octave, time) {
					voices.forEach(function(generator){
					generator.noteOn(get_frequency_of_note(note, octave), time);
				});
			},
			noteOff(note, octave, time){
				voices.forEach(function(generator){
					generator.noteOff(get_frequency_of_note(note, octave), time);
				});
			},
			connect({input}){
				output.connect(input);
			},
			render(screen){
				screen.brush = '#123';
				screen.clear();
				views.forEach(view => view.render(screen));
			}
		};
}
