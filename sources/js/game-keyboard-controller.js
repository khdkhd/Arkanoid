import Keyboard from 'keyboard';
import Vector from 'vector';

import constant from 'lodash.constant';

let left_pressed = false;
let right_pressed = false;

export default [
	Keyboard.createKeyHandler({
		code: Keyboard.LEFT_ARROW_KEY,
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
	Keyboard.createKeyHandler({
		code: Keyboard.RIGHT_ARROW_KEY,
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
	Keyboard.createKeyHandler({
		code: Keyboard.SPACE_BAR_KEY,
		event: 'fire',
		on_keydown: constant(true),
		on_keyup: constant(false)
	})
];
