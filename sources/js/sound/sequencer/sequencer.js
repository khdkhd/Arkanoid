import create_track from 'sound/sequencer/track';
import { create_audio_model } from 'sound/common/utils';

export default ({audio_context}) => {

	const pos = create_audio_model();
	const tempo = create_audio_model({
		init: () => 120
	});
	const tracks = {};
	let start_time = 0, time = 0;
	let precision = 4;
	let length = 16;
	let stop = true;

	function get_tick(){
		return 60/(tempo.value*precision);
	}

	return {
		start() {
			start_time = audio_context.currentTime;
			stop = false;
			time = 0;
		},
		stop(){
			pos.value = 0;
			stop = true;
		},
		play() {
			if(stop){
				return;
			}
			const current_time = audio_context.currentTime - start_time;
			if(current_time >= time){
				pos.value = ++pos.value % length;
				pos.emit('change', pos.value);
				for(let track of Object.values(tracks)){
					track.schedule(current_time);
				}
				time += get_tick();
			}
		},
		isStarted(){
			return !stop;
		},
		assign(track_id, slave){
			tracks[track_id] = create_track({tempo, slave, length, pos});
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
