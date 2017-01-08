import Vector from 'maths/vector';

import {KeyHandler, default as keyboard} from 'ui/keyboard';

import constant from 'lodash.constant';

let left_pressed = false;
let right_pressed = false;

export default [
	KeyHandler({
		code: keyboard.KEY_LEFT,
		event: 'direction-changed',
		on_keydown: () => {
			left_pressed = true;
			return Vector.Left;
		},
		on_keyup: () => {
			left_pressed = false;
			if (right_pressed) {
				return Vector.Right;
			}
			return Vector.Null;
		},
		repeat: false
	}),
	KeyHandler({
		code: keyboard.KEY_RIGHT,
		event: 'direction-changed',
		on_keydown: () => {
			right_pressed = true;
			return Vector.Right;
		},
		on_keyup: () => {
			right_pressed = false;
			if (left_pressed) {
				return Vector.Left;
			}
			return Vector.Null;
		},
		repeat: false
	}),
	KeyHandler({
		code: keyboard.KEY_SPACE,
		event: 'fire',
		on_keydown: constant(true),
		on_keyup: constant(false)
	}),
	KeyHandler({
		code: keyboard.KEY_P,
		event: 'pause',
		on_keypressed: () => constant(null)
	})
];
