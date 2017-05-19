import Vector from 'maths/vector';

import {KeyHandler, default as keyboard} from 'ui/keyboard';

import constant from 'lodash.constant';

export default function KeyboardController() {
	const state = {
		leftPressed: false,
		rightPressed: false
	};
	return [
		KeyHandler({
			code: keyboard.KEY_LEFT,
			event: 'direction-changed',
			on_keydown: () => {
				state.leftPressed = true;
				return Vector.Left;
			},
			on_keyup: () => {
				state.leftPressed = false;
				if (state.rightPressed) {
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
				state.rightPressed = true;
				return Vector.Right;
			},
			on_keyup: () => {
				state.rightPressed = false;
				if (state.leftPressed) {
					return Vector.Left;
				}
				return Vector.Null;
			},
			repeat: false
		}),
		KeyHandler({
			code: keyboard.KEY_SPACE,
			event: 'fire',
			on_keypressed: () => constant(null)
		}),
		KeyHandler({
			code: keyboard.KEY_P,
			event: 'pause',
			on_keypressed: () => constant(null)
		})
	];
}
