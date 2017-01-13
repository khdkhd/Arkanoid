import EventEmitter from 'events';
import { completeAssign as assign } from 'common/utils';

function create_enveloppe_generator(state){
	const attack = 	assign(new EventEmitter(), {
			set value(value){
				state.attack = value;
				this.emit('change', value);
			},
			get value(){
				return state.attack;
			}
	});

	const decay =  assign(new EventEmitter(), {
		set value(value){
			state.decay = value;
			this.emit('change', value);
		},
		get value(){
			return state.decay;
		}
	});

	const sustain =  assign(new EventEmitter(), {
		set value(value){
			state.sustain = value;
			this.emit('change', value);
		},
		get value(){
			return state.sustain;
		}
	});

	const release =  assign(new EventEmitter(), {
		set value(value){
			state.release = value;
			this.emit('change', value);
		},
		get value(){
			return state.release;
		}
	});
	return {
		connect({param}){
			state.param = param;
		},
		gateOn(time){
			state.param.cancelScheduledValues(time);
			state.param.setValueAtTime(0, time);
			state.param.linearRampToValueAtTime(1, time + state.attack);
			state.param.linearRampToValueAtTime(state.sustain, time + state.attack + state.decay);
		},
		gateOff(time){
			state.param.cancelScheduledValues(time);
			state.param.setValueAtTime(state.param.value, time);
			state.param.linearRampToValueAtTime(0, time + state.release);
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

export default()=>{
	const state = {
		attack: .0125,
		sustain: .25,
		decay: .00025,
		release: .0025,
		param: null
	};
	return create_enveloppe_generator(state);
}
