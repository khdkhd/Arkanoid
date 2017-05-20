import { MidiFile, Status, Meta } from 'midi-parse';
import Synth from 'sound/instruments/nsc-synth';
import Sequencer from 'sound/instruments/grid-sequencer';
import Mixer from 'sound/audio/mixer';

const fileInput = document.querySelector('#midi-file')

const eventTypes = Object.assign({}, Meta, Status)


fileInput.addEventListener('change', function() {
	const reader = new FileReader()
	reader.onload = e => {
		let data = new DataView(e.target.result, 0, e.target.result.byteLength)
		let midiFile = MidiFile(data)
		midiFile.tracks = midiFile.tracks
			.map(track => {
				track.events
					.forEach((event) => {
						event.type = Object.keys(eventTypes).find(key => eventTypes[key] === event.type)
					})
				return track
			})
		// console.log(JSON.stringify(midiFile, undefined, 4))
	}
	reader.readAsArrayBuffer(this.files[0])
})

const audio_context = new AudioContext();
const synth = Synth({audio_context});
const sequencer = Sequencer({audio_context});
sequencer.addSlave('synth', synth);
const mixer = Mixer({audio_context});
mixer.addTrack('synth', synth);
mixer.connect({input:audio_context.destination});

document.addEventListener('keydown', () => {
	synth.noteOn('C', 4, audio_context.currentTime);
}, true);

document.addEventListener('keyup', () => {
	synth.noteOff(null, null, audio_context.currentTime);
}, true);
