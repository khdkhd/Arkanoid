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
				max: 4
			}
		});

		let params = [];

		function gateOn(time){
			for(let param of params){
				param.cancelScheduledValues(time);
				param.setValueAtTime(0, time);
				param.linearRampToValueAtTime(1, time + attack.value);
				param.linearRampToValueAtTime(sustain.value, time + attack.value + decay.value);
			}
		}

		function gateOff(time){
			let _time = time + release.value;
			for(let param of params){
				param.cancelScheduledValues(time);
				param.setValueAtTime(param.value, time);
				param.linearRampToValueAtTime(0, _time);
			}
			return _time;
		}

		return {
			connect({param}){
				param.isControlled = true;
				params.push(param);
				param.on('noteon', time => {
					gateOn(time);
				});
				param.on('noteoff', ({time, onComplete}) => {
					onComplete(gateOff(time));
				});
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
