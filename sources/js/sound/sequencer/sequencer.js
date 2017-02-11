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

	function tick(){
		return 60/(tempo.value*precision);
	}

	return {
		start() {
			start_time = audio_context.currentTime;

		},
		play() {
			const current_time = audio_context.currentTime - start_time;
			if(current_time >= time){
				pos.value = ++pos.value % length;
				for(let track of Object.values(tracks)){
					track.schedule(current_time);
				}
				time += tick();
				pos.emit('change', pos.value);
			}
		},
		stop(){
			start_time = 0;
			for(let track of Object.values(tracks)){
				track.rewind();
			}
		},
		assign(track_id, slave){
			if(!tracks.hasOwnProperty(track_id)){
				tracks[track_id] = create_track({tempo, slave, length, pos});
			}
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
