import Vector from 'maths/vector';
import Rect from 'maths/rect';
import EventEmitter from 'events';
import _clamp from 'lodash.clamp';
import { completeAssign as assign } from 'common/utils';

const offset = 0;
const curve_start = -Math.PI/2 + offset;
const curve_end = 2*Math.PI - Math.PI/2 - offset;
const curve_length = curve_end - curve_start;
const inc_factor = 25;

function clamp(angle){
	return _clamp(angle, curve_start, curve_end);
}

function get_angle_increment(event){
	return Math.sign(-event.movementY)*curve_length/inc_factor;
}

function create_knob_view(state){
	return  {
		render(screen){
			screen.save();
			screen.pen =1;
			screen.pen = '#fff';
			screen.beginPath();
			screen.arc(state.pos, state.radius - 8, 0, 2*Math.PI);
			screen.drawPath();
			screen.beginPath();
			screen.arc(state.pos, state.radius - 32, 0, 2*Math.PI);
			screen.drawPath();
			screen.pen = 16;
			screen.pen = '#ccc';
			screen.beginPath();
			screen.arc(state.pos, state.radius - 20, curve_start, curve_end);
			screen.drawPath();
			screen.restore();
			screen.save();
			screen.pen = '#fff';
			screen.pen = 16;
			screen.beginPath();
			screen.arc(state.pos, state.radius - 20, curve_start, state.angle);
			screen.drawPath();
			screen.restore();
		}
	};
}

function create_knob_controller(state) {

	function tweak(event) {
		state.angle = clamp(state.angle + get_angle_increment(event));
		state.emitter.emit('change', (state.angle + Math.PI/2)/curve_length);
	}

	function update(value){
		state.angle = curve_length * value - Math.PI/2;
	}

	document.addEventListener('mousedown', event => {
		const x = event.clientX - event.target.offsetLeft;
		const y = event.clientY - event.target.offsetTop;
		if (state.bbox.contains({x: x,y: y})) {
			state.isActive = true;
		}
	});

	document.addEventListener('mouseup', () => {
		if (state.isActive) {
			state.isActive = false;
		}
	});

	document.addEventListener('mousemove', event => {
		if (state.isActive) {
			tweak(event);
		}
	});

	state.emitter.on('change', value => state.param.value = value);

	return {
		set param(audio_param){
			state.param = audio_param;
			state.param.on('change', value => {
				if(!state.isActive){
					update(value);
				}
			});
			update(audio_param.value);
		},
		get param(){
			return state.param;
		}
	};
}

export default ({pos, radius})=> {
	const state = {
		pos: pos,
		radius: radius,
		bbox: Rect(Vector(pos).add({x: -radius, y: -radius}), {width: radius*2, height: radius*2}),
		angle: curve_start,
		isActive: false,
		param: {
			value: 0,
			on: () => {}
		},
		emitter: new EventEmitter()
	};
	return assign(state.emitter, create_knob_view(state), create_knob_controller(state));
}
