import { EventEmitter } from 'events';
import { completeAssign as assign } from 'common/utils';
import is_nil from 'lodash.isnil';
import { scale, unscale } from 'sound/common/math';

export function createValueModel(){
	let _value= 0;
	return {
		set value(value){
			_value = value;
		},
		get value(){
			return _value;
		}
	}
}

export default ({param,  init, range} = {}) => {
	const emitter = new EventEmitter();
	let hasEnv = false;
	let events = [];
	if(is_nil(param)){
		param = createValueModel();
	}
	if(!is_nil(init)){
		param.value = init();
	}
	return assign(emitter, {
		set value(value){
			param.value = scale(range, value);
			emitter.emit('change', param.value);
			for(let event of events){
				emitter.emit(event[0], event[1]());
			}
		},
		get value(){
			return unscale(range, param.value);
		},
		setValueAtTime(value, time) {
			param.setValueAtTime(value, time)
		},
		linearRampToValueAtTime(value, time) {
			param.linearRampToValueAtTime(value, time);
		},
		exponentialRampToValueAtTime(value, time){
			param.exponentialRampToValueAtTime(value, time);
		},
		cancelScheduledValues(time){
			param.cancelScheduledValues(time);
		},
		registerEvent(eventId, handler) {
			events.push([eventId, handler]);
		},
		get param(){
			return param;
		},
		get hasEnv(){
			return hasEnv;
		},
		set hasEnv(value){
			hasEnv = value;
		}

	});
}
