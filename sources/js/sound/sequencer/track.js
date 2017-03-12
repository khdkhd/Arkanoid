import create_note from 'sound/sequencer/note';
import is_nil from 'lodash.isnil';
import times from 'lodash.times';
import EventEmitter from 'events';
import Pattern from 'sound/sequencer/pattern';
import { completeAssign as assign } from 'common/utils';

export default ({track_id, tempo, length, pos, current_pattern}) => {

	const emitter = new EventEmitter();
	let _slave;
	let grid = times(length, () => []);
	let patterns = times(10, ()=> Pattern({length}));
	let pattern = patterns[current_pattern.value].pattern;

	current_pattern.on('change', value => {
		pattern = patterns[value].pattern;
	});

	function playNotes(notes){
		notes.forEach(note=>{
				playNote(note);
		});
	}

	function playNote({note, octave, time, duration}){
		if(is_nil(_slave)) {
			return;
		}
		_slave.noteOn(note, octave, time);
		_slave.noteOff(note, octave, time + duration * 60 / tempo.value);
	}

	return assign(emitter, {
			set partition(matrix2d){
				// grid = matrix2d.map(notes =>
				// 	notes.map(create_note));
				// emitter.emit('change');
			},
			get partition(){
				return grid;
			},
			get pattern(){
				return pattern;
			},
			get id(){
				return track_id;
			},
			get pos(){
				return pos;
			},
			schedule(time){
				// playNotes(grid[pos.value].map(step => Object.assign({time}, step)));
				playNotes(pattern[pos.value].map(step => Object.assign({time}, step)));
			},
			assign(slave){
				_slave = slave;
			}
		});
	}
