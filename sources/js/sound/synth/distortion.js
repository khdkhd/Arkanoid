export function makeDistortionCurve(amount = 50) {
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  let x;
  for (let i = 0; i < n_samples; ++i) {
    x = i * 2 / n_samples - 1;
    curve[i] = (3 + amount) * x * 20 * deg / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

export default ({audio_context}) => {
  const distortion = audio_context.createWaveShaper();
  distortion.curve = makeDistortionCurve(800);
  distortion.oversample = '4x';

  return {
    connect({input, connect}){
      distortion.connect(input);
      return {connect};
    },
    get input(){
      return distortion
    }
  }
}
