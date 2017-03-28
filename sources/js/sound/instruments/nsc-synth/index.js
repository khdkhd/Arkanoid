import Core from './core'

export default({audio_context}) => {
  const core = Core({audio_context})

  const filterFreqKnob = CanvasView(Knob, {width: 50, height: 50});
  const filterQKnob = CanvasView(Knob, {width: 50, height: 50});
  const lfoFreqKnob = CanvasView(Knob, {width: 50, height: 50});
  const lfoAmpKnob = CanvasView(Knob, {width: 50, height: 50});

  return {
    render(){

    }
  }
}
