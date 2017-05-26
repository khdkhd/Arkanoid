import is_nil from 'lodash.isnil'
import EventEmitter from 'events';

export const Track = ({pattern}) => {

	const state = {
		pattern,
		slave: null,
		emitter: new EventEmitter()
	}

	const noteOn = (time, note) => {
		if(!is_nil(state.slave)){
			state.slave.noteOn(note.value, note.octave, time, note.velocity)
		}
	}

	const noteOff = (time, note) => {
		if(!is_nil(state.slave)){
			state.slave.noteOff(note.value, note.octave, time, note.velocity)
		}
	}

	return {
		handleEvents(time, tick){
			const events = state.pattern.getEvents(tick)
			events.forEach((event) => {
				switch(event.type){
					case 'NOTE_ON':
						return noteOn(time, event.data)
					case 'NOTE_OFF':
						return noteOff(time, event.data)
					case 'END_OFF_TRACK':
						state.slave.stop()
						return state.emitter.emit('eot');
				}
			})
		},
		setSlave(slave){
			state.slave = slave
			return this
		},
		setPattern(pattern){
			state.pattern = pattern
			return this
		},
		getPattern(){
			return state.pattern
		},
		getSlave(){
			return state.slave
		},
		onEndOffTrack(op){
			state.emitter.on('eot', op);
			return this
		}
	}
}
