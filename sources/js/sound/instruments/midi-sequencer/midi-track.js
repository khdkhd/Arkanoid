import is_nil from 'lodash.isnil'
import EventEmitter from 'events';
import { unscale } from '../../common/math';

export const MidiTrack = ({pattern}) => {

	const state = {
		pattern,
		slave: null,
		emitter: new EventEmitter()
	}

	const noteOn = (time, note) => {
		if(!is_nil(state.slave)){
			state.slave.noteOn(note.value, note.octave, time, unscale({min:0, max:127}, note.velocity))
		}
	}

	const noteOff = (time, note) => {
		if(!is_nil(state.slave)){
			state.slave.noteOff(note.value, note.octave, time)
		}
	}

	return {
		handleEvents(stTime, tick, tempo=100, division, buffer){
			const events = state.pattern.getEvents(tick, buffer)
			events.forEach((event) => {
				let time = stTime + event.time*60/(tempo*division)
				switch(event.type){
					case 'NOTE_ON':
						return noteOn(time, event.data)
					case 'NOTE_OFF':
						return noteOff(time, event.data)
					case 'SET_TEMPO':
						return state.emitter.emit('tempo', event.value);
					case 'END_OF_TRACK':
						// state.slave.stop(time)
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
		},
		onSetTempo(op){
			state.emitter.on('tempo', op)
			return this
		}
	}
}
