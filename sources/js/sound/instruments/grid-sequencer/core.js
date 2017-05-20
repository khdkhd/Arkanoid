import Sequencer from 'sound/sequencer'

export default ({audio_context}) => {
  const sequencer = Sequencer({audio_context});
  return {
    sequencer
  }
}
