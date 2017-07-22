import is_nil from 'lodash.isnil';
import { Sequencer } from 'sound/sequencer'
import { MidiTrack } from './midi-track'
import { MidiPattern } from './midi-pattern'

export const Core = ({ audio_context }) => {

	const tracks = {};

	const sequencer = Sequencer({ audio_context })
		.onPlay((time, tick, tempo, division) => {
			for (let track of Object.values(tracks)) {
				track.handleEvents(time, tick, tempo, division, 512);
			}
		})
		.onStop(()=> {
			for (let track of Object.values(tracks)) {
				track.getSlave().stop()
			}
		})

	return Object.assign({}, sequencer, {
		setSlave(id, slave) {
			if (is_nil(tracks[id])) {
				tracks[id] = MidiTrack({
					pattern: MidiPattern()
				})
			}
			tracks[id].setSlave(slave)
			return this
		},
		createTrack(id) {
			tracks[id] = MidiTrack({
				pattern: MidiPattern()
			})
			return tracks[id]
		},
		getTracks() {
			return tracks;
		},
		getTrack(id) {
			return tracks[id]
		}
	});
}
