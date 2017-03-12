import { EventEmitter } from 'events';
import { completeAssign as assign } from 'common/utils';
import is_nil from 'lodash.isnil';

export function scale(range, value){
	if(is_nil(range)){
		return value;
	}
	return (range.max-range.min) * value + range.min;
}

export function unscale(range, value){
	if(is_nil(range)){
		return value;
	}
	return (value-range.min)/(range.max-range.min);
}

export function get_frequency_of_note(note, octave) {
	const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
	let key_index = notes.indexOf(note);
	key_index = key_index + ((octave - 1) * 12) + 1;
	return 440 * Math.pow(2, (key_index - 49) / 12);
}

export function create_audio_model({param,  init, range} = {}) {
	const emitter = new EventEmitter();
	let isControlled = false;
	let events = [];
	if(is_nil(param)){
		param = create_value_model();
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
		get isControlled(){
			return isControlled;
		},
		set isControlled(value){
			isControlled = value;
		},

	});
}

export function create_value_model(){
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

export function get_cursor_position(canvas, event) {
	let rect = canvas.getBoundingClientRect();
	let x = event.clientX - rect.left;
	let y = event.clientY - rect.top;
	return {x,y};
}

export function create_canvas(element){
  const canvas = document.createElement('canvas');
  canvas.innerHTML = 'Your browser does not support canvas!';
  element.appendChild(canvas);
  return canvas;
}

/*
 * parses path using dot as a separator and returns
 * a reference to the nested object in params
 */
export function parse_parameters(path, params){
	let param = params;
	(path || '').split('.')
		.forEach(
			key=> param = param ? param[key]: params[key]
		);
	return param;
}
