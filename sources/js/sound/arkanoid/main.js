import { MidiFile, Status, Meta } from 'midi-parse';
import Synth from 'sound/instruments/nsc-synth';
import Sequencer from 'sound/instruments/grid-sequencer';
import Mixer from 'sound/audio/mixer';

const fileInput = document.querySelector('#midi-file')

const eventTypes = Object.assign({}, Meta, Status)

const audio_context = new AudioContext();
const synth = Synth({audio_context});
const sequencer = Sequencer({audio_context})
	.setTempo(230)
	.setSlave('synth', synth);
Mixer({audio_context})
	.addTrack('synth', synth)
	.connect({input:audio_context.destination});
fileInput.addEventListener('change', function() {
	const reader = new FileReader()
	reader.onload = e => {
		let data = new DataView(e.target.result, 0, e.target.result.byteLength)
		let midiFile = MidiFile(data)
		midiFile.tracks = midiFile.tracks
			.map((track) => {
				let delta = 0;
				return Object.assign(track, {
					events: track.events.map((event) => {
						event.type = Object.keys(eventTypes).find(key => eventTypes[key] === event.type)
						event.time = delta + event.delta
						delta += event.delta
						return event
					})
				})
			});
		const track = midiFile.tracks
			.find(track => track.events.find(event => event.type === 'NOTE_ON') !== undefined)
		sequencer.getTrack('synth').getPattern().setEvents(track.events)
	}
	reader.readAsArrayBuffer(this.files[0])
})
