import Track from 'sound/sequencer/track';
import Model from 'sound/common/model';
import is_nil from 'lodash.isnil';

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

	const pos = Model({
		init: () => -1
	});
	const tempo = Model({
		init: () => 120
	});
	const current_pattern = Model({
		init: () => 1
	});
	const current_track = Model({
		init: () => 1
	});

	current_track.registerEvent(
		'change:track',
		() => ({key: current_track.value, track: tracks[current_track.value]})
	);

	const tracks = {};
	let precision = 4;
	let length = 32;
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
		addSlave(track_id, slave){
			if(is_nil(tracks[track_id])){
				tracks[track_id] = Track({track_id, tempo, length, pos, current_pattern});
			}
			tracks[track_id].assign(slave);
		},
		get tempo(){
			return tempo;
		},
		get tracks(){
			return tracks;
		},
		get pos(){
			return pos;
		},
		get pattern(){
			return current_pattern;
		},
		get track(){
			return current_track;
		}
	};
}
