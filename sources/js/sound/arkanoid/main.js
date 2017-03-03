import {
	createSequencer,
	createSynth,
	createMixer,
} from 'sound';
import GridManager from 'sound/sequencer/view/grid-manager';
import is_nil from 'lodash.isnil';
import cond from 'lodash.cond';
import no_op from 'lodash.noop';
import create_controls from 'sound/controls';
import ui from 'sound/controls/ui';
import {	default as keyboard } from 'ui/keyboard';
import Kick from 'sound/synth/kick';

const view_factory = create_controls();
const views = [];

const synth_patch = {
	nodes: [{
			id: 'generator',
			factory: 'mono',
			type: 'voice',
			config: {
				type: {
					value: 'sawtooth'
				}
			}
		},
		{
			id: 'enveloppe',
			factory: 'enveloppe',
			config: {
				attack: {
					value: 0
				},
				decay: {
					value: .25
				},
				sustain: {
					value: .5
				},
				release: {
					value: 0
				}
			}
		},
		{
			id: 'filter',
			factory: 'filter',
			type: 'output',
			config:{
				frequency:{
					value: .95,
					views: [{
						factory: 'knob'
					}]
				},
				Q: {
					value: 0,
					views: [{
						factory: 'knob'
					}]
				},
				gain: {
					value: .95
				},
				type: {
					value: 'lowpass'
				}
			},
		},
		{
			id: 'lfo',
			factory: 'lfo',
			config: {
				frequency: {
					value: .125
				},
				amplitude: {
					value: 0.9
				},
				type: {
					value: 'sine'
				}
			}
		},
	],
	connexions: [
		['generator', 'filter'],
		['lfo', 'filter'],
		// ['enveloppe', 'generator']
	]

};



// const introduction_partition = [
// 		[{
// 			note: 'A',
// 			octave: 2,
// 			duration: 'QUARTER'
// 		}], [], [], [{
// 			note: 'A',
// 			octave: 2,
// 			duration: 'QUARTER'
// 		}], [], [], [{
// 			note: 'A',
// 			octave: 2,
// 			duration: 'QUARTER'
// 		}], [], [], [], [{
// 			note: 'A',
// 			octave: 2,
// 			duration: 'QUARTER'
// 		}], [],
// 		[{
// 			note: 'A',
// 			octave: 2,
// 			duration: 'WHOLE'
// 		}], [], [{
// 			note: 'D',
// 			octave: 2,
// 			duration: 'QUARTER'
// 		}], []
// ];


const audio_context = new AudioContext();

const seq = createSequencer({
	audio_context
});
const synth = createSynth({
	audio_context
});
const mixer = createMixer({
	audio_context
});

const kick = Kick({audio_context});

synth.patch(synth_patch);
seq.assign('1', synth);
seq.assign('2', kick);
// seq.tracks['track_1'].partition = introduction_partition;
mixer.assign('1', synth);
mixer.assign('2', kick);
mixer.connect({
	input: audio_context.destination
});
mixer.tracks['1'].gain.value = 1;
mixer.tracks['2'].gain.value = 1;

ui.bind_events({
	keypress: {
		code: keyboard.KEY_SPACE,
		event: 'play',
		keyup: cond([[seq.isStarted, seq.stop], [()=> true, seq.start]]),
		keydown: no_op
	}
});



//seq.start();

function mount_synth(element){
	const controls = element.querySelectorAll('[data-control]');
	for(let control of controls){
		let view_name = control.getAttribute('data-control');
		let path = control.getAttribute('data-param');
		if(is_nil(path)){
			continue;
		}
		path = path.split('.');
		const node = synth.nodes[path[0]];
		const param = node[path[1]];
		const view = view_factory.bindParameter({
			factory: view_name,
			options: {
				element: control
			}
		}, param);
		views.push(view);
	}
}

function mount_mixer(element){
	const controls = element.querySelectorAll('[data-control]');
	for(let control of controls){
		let view_name = control.getAttribute('data-control');
		let path = control.getAttribute('data-param');
		if(is_nil(path)){
			continue;
		}
		path = path.split('.');
		const track = mixer.tracks[path[0]];
		const param = track[path[1]];
		const view = view_factory.bindParameter({
			factory: view_name,
			options: {
				element: control
			}
		}, param);
		views.push(view);
	}
}

let grid;

function mount_sequencer(element){
	const controls = element.querySelectorAll('[data-control]');
	for(let control of controls){
		let path = control.getAttribute('data-param');
		if(is_nil(path)){
			continue;
		}
		if('grid' === control.getAttribute('data-control')){
			grid = GridManager({element: control, width: 800, height: 600});
			for(let track of Object.values(seq.tracks)){
				grid.addTrack(track);
			}
			grid.selectTrack(seq.tracks['1']);
			views.push(grid);
		}
	}
}

const synthElement = document.querySelector('[data-device="synth"]');
const seqElement = document.querySelector('[data-device="seq"]');
const mixerElement = document.querySelector('[data-device="mixer"]');
mount_synth(synthElement);
mount_sequencer(seqElement);
mount_mixer(mixerElement);

ui.bind_events({
	keypress: {
		code: keyboard.KEY_1,
		event: 'trackchange',
		keyup(){
			grid.selectTrack(seq.tracks['1']);
		},
		keydown: no_op
	}
});

ui.bind_events({
	keypress: {
		code: keyboard.KEY_2,
		event: 'trackchange',
		keyup(){
			grid.selectTrack(seq.tracks['2']);
		},
		keydown: no_op
	}
});

function loop() {
	views.forEach(view => view.render());
	seq.play();
	requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
