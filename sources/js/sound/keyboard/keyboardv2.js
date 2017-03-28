import is_nil from 'lodash.isnil';

export default ({audio_context} = {}) => {

  let slave = null;

	return {
		setSlave(instrument){
			slave = instrument
		},
		noteOn(note, octave){
      if(is_nil(slave)){
        return
      }
			slave.noteOn(note, octave, audio_context.currentTime);
		},
    noteOff(){
      slave.noteOff(null, null, audio_context.currentTime);
    },
		arpegiate(time, interval, notes) {
			for(let note of notes){
				slave.noteOn(note.note, note.octave, time);
				slave.noteOff(note.note, note.octave, time + note.duration);
				time += interval;
			}
		}
	};
}
