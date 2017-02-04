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
	 * Creates a node from a json object description
	 */
	function create_node(desc){
		const node = factory[desc.factory](Object.assign({audio_context}, desc.options));
		for(let [param, config] of Object.entries(Object.assign({}, desc.config))){
				node[param].value = config.value;
				console.log(config.views);
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
				if(desc.type === 'output'){
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
