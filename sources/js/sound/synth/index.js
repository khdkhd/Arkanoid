import enveloppe from 'sound/synth/enveloppe';
import filter from 'sound/synth/filter';
import lfo from 'sound/synth/lfo';
import mono from 'sound/synth/mono';
import poly from 'sound/synth/poly';
import amp from 'sound/synth/amp';

import { get_frequency_of_note } from 'sound/common/utils';

const factory = {
	enveloppe,
	filter,
	lfo,
	mono,
	poly,
	amp
};


export default ({audio_context}) => {

	const voices = [];
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
				//bind_views(node[param], config.views);
		}
		return node;
	}

	return {
		get factory(){
			return factory;
		},
		get nodes(){
			return nodes;
		},
		patch(patch) {
			nodes = patch.nodes.reduce((nodes, desc) => {
				const node = create_node(desc);
				if(desc.type === 'voice'){
					voices.push(node);
				}
				if(desc.type === 'output'){
					output = node;
				}
				if(desc.output){
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
		}
	};
}
