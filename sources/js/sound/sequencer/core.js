import create_track from 'sound/sequencer/track';

export default ({audio_context}) => {


	function tick(){
		return 60/(tempo*precision);
	}

	const tracks = {};
	let start_time = 0, time = 0;
	let precision = 4, tempo = 120;
	let stop = false;

	return {
		start() {
			start_time = audio_context.currentTime;

		},
		play(){
			const current_time = audio_context.currentTime - start_time;
			if(current_time >= time){
				for(let track of Object.values(tracks)){
					track.schedule(current_time);
				}
				time += tick();
			}
		},
		stop(){
			stop = true;
			start_time = 0;
			for(let track of Object.values(tracks)){
				track.rewind();
			}
		},
		set tempo(value){
			tempo = value;
		},
		assign(track_id, slave){
			if(!tracks.hasOwnProperty(track_id)){
				tracks[track_id] = create_track({tempo, slave});
			}
		},
		get tracks(){
			return tracks;
		}
	};
}
