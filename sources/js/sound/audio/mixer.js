import create_track from 'sound/audio/track';

export default({audio_context}) => {
	const channel_merger = audio_context.createChannelMerger(4);
	const compressor = audio_context.createDynamicsCompressor();
	compressor.threshold.value = -50;
	compressor.knee.value = 40;
	compressor.ratio.value = 12;
	compressor.attack.value = 0;
	compressor.release.value = 0.25;
	channel_merger.connect(compressor);

  const tracks = {};

	return {
		connect({input}){
			compressor.connect(input);
			return this
		},
		get input(){
			return compressor;
		},
		addTrack(track_id, instrument){
			if(!tracks.hasOwnProperty(track_id)){
				tracks[track_id] = create_track({audio_context});
			}
			tracks[track_id].assign(instrument);
			tracks[track_id].connect({input:compressor});
			return this;
		},
		get tracks(){
			return tracks;
		}
	};
}
