import synthFactory from 'sound/synth/factory';
import controlFactory from 'sound/controls/factory';
import is_nil from 'lodash.isnil';
import {get_frequency_of_note } from 'sound/common/utils';

function create_synth(state) {
	return {
		patch(patch) {
			state.mods = patch.nodes.reduce((mods, node)=> {
				const options = Object.assign({}, node.options)
				options.factory = synthFactory;
				mods[node.id] = synthFactory[node.factory](state.audio_context, options);
				const config = node.config;
				Object.keys(config).forEach(param => {
					mods[node.id][param].value = config[param].value;
					if(!is_nil(config[param].views)){
						config[param].views.forEach(view_def =>{
							const view = controlFactory[view_def.factory](view_def.options);
							view.param = mods[node.id][param];
							state.views.push(view);
						});
					}
				});
				if(node.voice){
					state.voices.push(mods[node.id]);
				}
				if(node.output){
					state.output = mods[node.id];
				}
				return mods;
			}, {});
			for(let con of patch.connexions){
				state.mods[con[0]].connect(state.mods[con[1]]);
			}
		},
		noteOn(note, octave, time) {
			state.voices.forEach(function(generator){
				generator.noteOn(get_frequency_of_note(note, octave), time);
			});
		},
		noteOff(note, octave, time){
			state.voices.forEach(function(generator){
				generator.noteOff(get_frequency_of_note(note, octave), time);
			});
		},
		connect({input}){
			state.output.connect(input);
		},
		render(screen){
			screen.brush = '#123';
			screen.clear();
			state.views.forEach(view => view.render(screen));
		}
	};
}

export default audio_context  => {
	const state ={
		audio_context: audio_context,
		output: null,
		voices: [],
		mods: [],
		views: []
	}
	return create_synth(state);
}
