import {
	createSequencer,
	createSynth,
	createMixer,
} from 'sound';
import cond from 'lodash.cond';
import no_op from 'lodash.noop';
import create_controls from 'sound/controls';
import ui from 'sound/controls/ui';
import {	default as keyboard } from 'ui/keyboard';
import Kick from 'sound/synth/kick';
import Snare from 'sound/synth/snare';

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
	['enveloppe', 'generator']
]

};

const audio_context = new AudioContext();

const sequencer = createSequencer({
	audio_context
});
const synth = createSynth({
	audio_context
});
const mixer = createMixer({
	audio_context
});

const kick = Kick({audio_context});
const snare = Snare({audio_context});

synth.patch(synth_patch);
sequencer.assign('1', synth);
sequencer.assign('2', kick);
sequencer.assign('3', snare);
// sequencer.tracks['track_1'].partition = introduction_partition;
mixer.assign('1', synth);
mixer.assign('2', kick);
mixer.assign('3', snare);
mixer.connect({
	input: audio_context.destination
});
mixer.tracks['1'].gain.value = 1;
mixer.tracks['2'].gain.value = 1;

ui.bind_events({
	keypress: {
		code: keyboard.KEY_SPACE,
		event: 'play',
		keyup: cond([[sequencer.isStarted, sequencer.stop], [()=> true, sequencer.start]]),
		keydown: no_op
	}
});



//seq.start();

function mount_synth(element, synth){
	const controls = element.querySelectorAll('[data-control]');
	for(let control of controls){
		const view = view_factory.mount(control, synth);
		views.push(view);
	}
}

function mount_mixer(element, mixer){
	const controls = element.querySelectorAll('[data-control]');
	for(let control of controls){
		const view = view_factory.mount(control, mixer);
		views.push(view);
	}
}

function mount_sequencer(element, sequencer){
	const controls = element.querySelectorAll('[data-control]');
	for(let control of controls){
		if('keyboard' === control.getAttribute('data-control')){
			const keyboard = view_factory.mount(control, sequencer);
			views.push(keyboard);
		}
		if('grid' === control.getAttribute('data-control')){
			const grid = view_factory.mount(control, sequencer);
			for(let track of Object.values(sequencer.tracks)){
				grid.addTrack(track);
			}
			grid.selectTrack(sequencer.tracks['2']);
			ui.bind_events({
				keypress: {
					code: keyboard.KEY_1,
					event: 'trackchange',
					keyup(){
						grid.selectTrack(sequencer.tracks['1']);
					},
					keydown: no_op
				}
			});
			ui.bind_events({
				keypress: {
					code: keyboard.KEY_2,
					event: 'trackchange',
					keyup(){
						grid.selectTrack(sequencer.tracks['2']);
					},
					keydown: no_op
				}
			});
			ui.bind_events({
				keypress: {
					code: keyboard.KEY_3,
					event: 'trackchange',
					keyup(){
						grid.selectTrack(sequencer.tracks['3']);
					},
					keydown: no_op
				}
			});
			views.push(grid);
		}
	}
}

const synthElement = document.querySelector('[data-device="synth"]');
const seqElement = document.querySelector('[data-device="seq"]');
const mixerElement = document.querySelector('[data-device="mixer"]');
mount_synth(synthElement, synth.nodes);
mount_sequencer(seqElement, sequencer);
mount_mixer(mixerElement, mixer);



function loop() {
	views.forEach(view => view.render());
	sequencer.play();
	requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
