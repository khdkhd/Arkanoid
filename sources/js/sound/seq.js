import is_nil from 'lodash.isnil';

export default function createSequencer(audio_context, options){
	const slave = options.slave;
	let tempo = 120;
	let time, tick, pos;
	let grid = [];
	let ticks;
	let stop = false;
	return {
		play() {
			while (pos < ticks) {
					for (let track of grid) {
					if (!is_nil(track[pos].note)) {
						this.playNote(track[pos]);
					}
				}
				this.tick();
			}
			if(!stop){
				pos = 0;
			}
		},
		stop(){
			stop = true;
		},
		loadPattern(pattern){
			grid = pattern;
			ticks = grid[0].length;
		},
		playNote({note, octave, duration}){
			slave.noteOn(note, octave, time);
			slave.noteOff(note, octave, time + duration * ticks);
		},
		start(){
			this.tempo = tempo;
			time = audio_context.currentTime;
			pos = 0;
		},
		tick(){
			time += tick;
			pos++;
		},
		set tempo(value){
			tempo = value;
			tick = tempo / (60 * ticks);
		}
	};
}
