import { NscSynth } from 'sound/instruments/nsc-synth';
import Sequencer from 'sound/instruments/midi-sequencer';
import Mixer from 'sound/audio/mixer';
import { MidiFile, Status, Meta } from 'midi-parse'
import Grid from 'sound/instruments/midi-sequencer/grid'

const eventTypes = Object.assign({}, Meta, Status)

const audio_context = new AudioContext()


const sequencer = Sequencer({ audio_context }).setTempo(100)

const mixer = Mixer({ audio_context })
	.connect({ input: audio_context.destination })

document.querySelector('#midi-file')
	.addEventListener('change', (event) => {
		const reader = new FileReader()
		reader.onload = e => {
			let data = new DataView(e.target.result, 0, e.target.result.byteLength)
			let midiFile = MidiFile(data)
			midiFile.tracks = midiFile.tracks
				.map((track) => {
					let delta = 0;
					Object.assign(track, {
						events: track.events.map((event) => {
							event.type = Object.keys(eventTypes)
								.find(key => eventTypes[key] === event.type)
							event.time = delta + event.delta
							delta += event.delta
							return event
						})
					})
					return track
				});
			sequencer.setDivision(midiFile.division);
			let n = midiFile.tracks.length
			midiFile.tracks.forEach((track, i)=> {
				// const grid = Grid({
				// 	width: 800,
				// 	height: 300
				// })
				// document.querySelector('body')
				// 	.appendChild(grid.render().el());
				const synth = NscSynth({ audio_context })
				sequencer.createTrack('Track ' + i)
					.setSlave(synth)
					.getPattern()
					.setEvents(track.events)

				mixer.addTrack('Track ' + i, synth)
			})

		}
		reader.readAsArrayBuffer(event.target.files[0])
	})

