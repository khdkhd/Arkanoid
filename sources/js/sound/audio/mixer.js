import create_track from 'sound/audio/track';

export default({audio_context}) => {
	const channel_merger = audio_context.createChannelMerger(4);
  const tracks = {};

	return {
		connect({input}){
			channel_merger.connect(input);
		},
		get input(){
			return channel_merger;
		},
		addTrack(track_id, instrument){
			if(!tracks.hasOwnProperty(track_id)){
				tracks[track_id] = create_track({audio_context});
			}
			tracks[track_id].assign(instrument);
			tracks[track_id].connect({input:channel_merger});
		},
		get tracks(){
			return tracks;
		}
	};
}
