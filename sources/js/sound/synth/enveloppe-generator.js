import { create_audio_model } from 'sound/common/utils';

export default()=>{

		const attack = create_audio_model({
			range: {
				min: 0,
				max: 1
			}
		});
		const decay = create_audio_model({
			range: {
				min: 0,
				max: 1
			}
		});
		const sustain = create_audio_model({
			range: {
				min: 0,
				max: 1
			}
		});
		const release = create_audio_model({
			range: {
				min: 0,
				max: 1
			}
		});

		let parameter;

		return {
			connect({param}){
				parameter = param;
			},
			gateOn(time){
				parameter.cancelScheduledValues(time);
				parameter.setValueAtTime(0, time);
				parameter.linearRampToValueAtTime(1, time + attack.value);
				parameter.linearRampToValueAtTime(sustain.value, time + attack.value + decay.value);
			},
			gateOff(time){
				parameter.cancelScheduledValues(time);
				parameter.setValueAtTime(parameter.value, time);
				parameter.linearRampToValueAtTime(0, time + release.value);
			},
			get attack(){
				return attack;
			},
			get decay(){
				return decay;
			},
			get sustain(){
				return sustain;
			},
			get release(){
				return release;
			}
		};
}
