import Kick from 'sound/synth/kick';
import Snare from 'sound/synth/snare';

export default ({audio_context}) => {
  const kick = Kick({audio_context});
  const snare = Snare({audio_context});
}
