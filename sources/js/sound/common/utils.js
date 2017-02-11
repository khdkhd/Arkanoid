import { EventEmitter } from 'events';
import { completeAssign as assign } from 'common/utils';
import is_nil from 'lodash.isnil';

function scale(range, value){
	if(is_nil(range)){
		return value;
	}
	return (range.max-range.min) * value + range.min;
}

function unscale(range, value){
	if(is_nil(range)){
		return value;
	}
	return (value-range.min)/(range.max-range.min);
}

function get_frequency_of_note(note, octave) {
	const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
	let key_index = notes.indexOf(note);
	key_index = key_index + ((octave - 1) * 12) + 1;
	return 440 * Math.pow(2, (key_index - 49) / 12);
}

function create_audio_model({param,  init, range} = {}) {
	const emitter = new EventEmitter();
	if(is_nil(param)){
		param = create_value_model();
	}
	if(!is_nil(init)){
		param.value = init();
	}
	return assign(emitter,{
		set value(value){
			param.value = scale(range, value);
			emitter.emit('change', param.value);
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
		cancelScheduledValues(time){
			param.cancelScheduledValues(time);
		},
	});
}

function create_value_model(){
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


export {
	scale,
	unscale,
	get_frequency_of_note,
	create_audio_model,
	create_value_model,
};
