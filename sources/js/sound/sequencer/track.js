import create_note from 'sound/sequencer/note';
import is_nil from 'lodash.isnil';
import times from 'lodash.times';
import EventEmitter from 'events';

export default ({track_id, tempo, slave, length, pos}) => {

	const emitter = new EventEmitter();
	let _slave = slave;
	let grid = times(length, () => []);

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

	return Object.assign(emitter, {
			set partition(matrix2d){
				grid = matrix2d.map(notes =>
					notes.map(create_note));
				emitter.emit('change');
			},
			get partition(){
				return grid;
			},
			get id(){
				return track_id;
			},
			get pos(){
				return pos;
			},
			schedule(time){
				playNotes(grid[pos.value].map(step => Object.assign({time}, step)));
			},
			assign(slave){
				_slave = slave;
			}
		});
	}
