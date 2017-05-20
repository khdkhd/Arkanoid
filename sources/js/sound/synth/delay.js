import Model from 'sound/common/model';

export default function delay({audio_context}){
  const time_range = {
    min: 0,
    max: 1
  };

  const delay = audio_context.createDelay(100);
  const gain = audio_context.createGain();

  const time = Model({
    param: delay.delayTime,
    range: time_range,
    init: ()=> 0
  })

  const feedback = Model({
    param: gain.gain
  })

  return {
    connect({input, connect}){
      delay.connect(gain);
      gain.connect(delay);
      delay.connect(input);
      return {connect};
    },
    get input(){
      return delay;
    },
    get time(){
      return time;
    },
    get feedback(){
      return feedback;
    }
  };
}
