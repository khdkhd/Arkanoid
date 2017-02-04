import synth_factory from 'sound/synth/factory';
import control_factory from 'sound/controls/factory';
import {get_frequency_of_note } from 'sound/common/utils';
import is_nil from 'lodash.isnil';

export default ({audio_context})  => {

		const voices = [];
		const views = [];
		let output, mods;

		function bind_views(param, view_defs = []){
			view_defs.forEach(view_def => {
				const view = control_factory[view_def.factory](view_def.options);
				view.param = param;
				views.push(view);
			});
		}

		return {
			patch(patch) {
				mods = patch.nodes.reduce((mods, node)=> {
					const options = Object.assign({}, node.options)
					options.factory = synth_factory;
					const mod = synth_factory[node.factory](Object.assign({audio_context}, options));
					for(let [param, config] of Object.entries(Object.assign({}, node.config))){
						console.log(param, config);
						if(!is_nil(mod[param])){
							mod[param].value = config.value;
							bind_views(mod[param], config.views);
						}
					}
					if(node.voice){
						voices.push(mod);
					}
					if(node.output){
						output = mod;
					}
					mods[node.id] = mod;
					return mods;
				}, {});
				for(let con of patch.connexions){
					mods[con[0]].connect(mods[con[1]]);
				}
			},
			noteOn(note, octave, time) {
					voices.forEach((generator) => {
					generator.noteOn(get_frequency_of_note(note, octave), time);
				});
			},
			noteOff(note, octave, time){
				voices.forEach((generator) => {
					generator.noteOff(time);
				});
			},
			connect({input}){
				output.connect(input);
			},
			render(screen){
				views.forEach(view => view.render(screen));
			}
		};
}
