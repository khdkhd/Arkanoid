import create_track from 'sound/sequencer/track';
import { create_audio_model } from 'sound/common/utils';

export default ({audio_context}) => {

	function get_tick(){
		return 60/(tempo.value*precision);
	}

	function schedule(callback){
		const current_time = audio_context.currentTime - start_time;
		if(current_time >= time){
			callback(current_time);
			time += get_tick();
		}
	}

	const pos = create_audio_model({
		init: () => -1
	});
	const tempo = create_audio_model({
		init: () => 120
	});
	const tracks = {};
	let precision = 4;
	let length = 16;
	let stop = true;
	let time = 0;
	let start_time = audio_context.currentTime;

	return {
		start() {
			stop = false
		},
		stop(){
			pos.value = -1;
			pos.emit('change', pos.value);
			stop = true;
		},
		play() {
			schedule(current_time => {
				if(!stop){
					pos.value = ++pos.value % length;
					pos.emit('change', pos.value);
					for(let track of Object.values(tracks)){
						track.schedule(current_time);
					}
				}
			});
		},
		isStarted() {
			return !stop;
		},
		assign(track_id, slave){
			tracks[track_id] = create_track({track_id, tempo, slave, length, pos});
		},
		get tempo(){
			return tempo;
		},
		get tracks(){
			return tracks;
		},
		get pos(){
			return pos;
		}
	};
}
