import cond from 'lodash.cond';
import is_nil from 'lodash.isnil';
import EventEmitter from 'events';

import {completeAssign} from 'common/utils';

function create_keyboard_event_handler(name, handlers, emitter) {
	const handle = cond(handlers
		.filter(handler => !is_nil(handler[name]))
		.map(handler => [key => key === handler.code, handler[name]])
	);
	return ev => {
		const event_data = handle(ev.keyCode);
		if (!is_nil(event_data)) {
			emitter.emit(event_data.event, event_data.data);
			ev.preventDefault();
			ev.stopPropagation();
		}
	}
}

function create_key_handler({
	code,
	event,
	on_keydown,
	on_keyup,
	on_keypressed,
	repeat = true}) {
	let pressed = false;
	const invoke = (handler, arg) => {
		const data = handler(arg);
		return Object.assign({event}, is_nil(data) ? {} : {data});
	}
	const callbacks = Object.assign(is_nil(on_keypressed)
		? {
			keydown(arg) {
				if (!pressed || repeat) {
					pressed = true;
					return invoke(on_keydown, arg);
				}
			},
			keyup(arg) {
				pressed = false;
				return invoke(on_keyup, arg);
			}
		}
		: {keypress(arg) {return invoke(on_keypressed, arg);}}
	);
	return Object.assign({code}, callbacks);
}

const keys = {
	get KEY_ENTER() {return  13;},
	get KEY_SPACE() {return  32;},
	get KEY_LEFT()  {return  37;},
	get KEY_UP()    {return  38;},
	get KEY_RIGHT() {return  39;},
	get KEY_DOWN()  {return  40;},
	get KEY_0()     {return  48;},
	get KEY_1()     {return  49;},
	get KEY_2()     {return  50;},
	get KEY_3()     {return  51;},
	get KEY_4()     {return  52;},
	get KEY_5()     {return  53;},
	get KEY_6()     {return  54;},
	get KEY_7()     {return  55;},
	get KEY_8()     {return  56;},
	get KEY_9()     {return  57;},
	get KEY_A()     {return  97;},
	get KEY_B()     {return  98;},
	get KEY_C()     {return  99;},
	get KEY_D()     {return  100;},
	get KEY_E()     {return  101;},
	get KEY_F()     {return  102;},
	get KEY_G()     {return  103;},
	get KEY_H()     {return  104;},
	get KEY_I()     {return  105;},
	get KEY_J()     {return  106;},
	get KEY_K()     {return  107;},
	get KEY_L()     {return  108;},
	get KEY_M()     {return  109;},
	get KEY_N()     {return  110;},
	get KEY_O()     {return  111;},
	get KEY_P()     {return  112;},
	get KEY_Q()     {return  113;},
	get KEY_R()     {return  114;},
	get KEY_S()     {return  115;},
	get KEY_T()     {return  116;},
	get KEY_U()     {return  117;},
	get KEY_V()     {return  118;},
	get KEY_W()     {return  119;},
	get KEY_X()     {return  120;},
	get KEY_Y()     {return  121;},
	get KEY_Z()     {return  122;},
};

const emitter = new EventEmitter();
const state = {
	keydown: null,
	keyup: null,
	keypress: null
};

export const KeyHandler = create_key_handler;

export default completeAssign(emitter, keys, {
	use(key_handlers) {
		for (let [event, handler] of Object.entries(state)) {
			if (!is_nil(handler)) {
				document.removeEventListener(event, handler);
			}
			if (!is_nil(key_handlers)) {
				state[event] = create_keyboard_event_handler(event, key_handlers, emitter);
				document.addEventListener(event, state[event]);
			}
		}
	}
});
