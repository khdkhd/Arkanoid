import is_nil from 'lodash.isnil';
import { Sequencer, Pattern, Track } from 'sound/sequencer'

export const Core = ({audio_context}) => {

  const tracks = {};

  const sequencer = Sequencer({audio_context})
  .onPlay((time, tick) => {
    for (let track of Object.values(tracks)) {
      track.handleEvents(time, tick);
    }
  });

  return Object.assign({}, sequencer, {
    setSlave(id, slave) {
      if (is_nil(tracks[id])) {
        tracks[id] = Track({
          pattern: Pattern()
        })
      }
      tracks[id].setSlave(slave)
      return this
    },
    getTracks() {
      return tracks;
    },
    getTrack(id){
      return tracks[id]
    }
  });
}
