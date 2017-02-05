import enveloppe from 'sound/synth/enveloppe';
import filter from 'sound/synth/filter';
import lfo from 'sound/synth/lfo';
import mono from 'sound/synth/mono';
import poly from 'sound/synth/poly';
import amp from 'sound/synth/amp';

import create_controls from 'sound/controls';

import { get_frequency_of_note } from 'sound/common/utils';

const factory = {
	enveloppe,
	filter,
	lfo,
	mono,
	poly,
	amp
};

const controls = create_controls();


export default ({audio_context}) => {

	const voices = [];
	const views = [];
	let output, nodes;

	/**
	 * Creates an audio node from a json object description
	 */
	function create_node(desc){
		const node_factory = factory[desc.factory];
		const factory_params = Object.assign({audio_context}, desc.options);
		const node = node_factory(factory_params);
		desc.config = desc.config || {};
		for(let [param, config] of Object.entries(desc.config)){
				node[param].value = config.value;
				bind_views(node[param], config.views);
		}
		return node;
	}

	function bind_views(param, descs = []){
		descs.forEach(desc => {
			const view = controls.bindParameter(desc, param);
			views.push(view);
		});
	}

	return {
		get factory(){
			return factory;
		},
		patch(patch) {
			nodes = patch.nodes.reduce((nodes, desc) => {
				const node = create_node(desc);
				if(desc.type === 'voice'){
					voices.push(node);
				}
				console.log(desc.type);
				if(desc.type === 'output'){
					console.log('desc type is output');
					output = node;
				}
				if(desc.output){
					console.log('desc type is output from boolean');
					output = node;
				}
				nodes[desc.id] = node;
				return nodes;
			}, {});
			for(let con of patch.connexions){
				nodes[con[0]].connect(nodes[con[1]]);
			}
		},
		connect({input}){
			output.connect(input);
		},
		noteOn(note, octave, time){
			for(let voice of voices){
				voice.noteOn(get_frequency_of_note(note, octave), time);
			}
		},
		noteOff(note, octave, time){
			for(let voice of voices){
				voice.noteOff(time);
			}
		},
		render(){
			for(let view of views) {
				view.render();
			}
		}
	};
}
