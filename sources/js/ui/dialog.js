import {EventEmitter} from 'events';

import is_function from 'lodash.isfunction';
import is_nil from 'lodash.isnil';
import noop from 'lodash.noop';

function overlay(parent) {
	let overlay = parent.querySelector('body > #modal-overlay');
	if (is_nil(overlay)) {
		overlay = document.createElement('div');
		overlay.id = 'modal-overlay';
		parent.appendChild(overlay);
	}
	return overlay;
}

function dialog_button(parent, role, label = '') {
	const item = document.createElement('li');
	const button = document.createElement('button');

	button.dataset.role = role;
	button.innerHTML = label;

	item.appendChild(button);
	parent.appendChild(item);

	return button;
}

function dialog_buttons(parent, buttons_descriptors) {
	const buttons_wrapper = document.createElement('ul');
	const emitter = new EventEmitter();

	parent.appendChild(buttons_wrapper);
	buttons_wrapper.className = 'buttons-wrapper';
	buttons_descriptors.forEach(({id, label}) => {
		const button = dialog_button(buttons_wrapper, id, label);
		const on_click = () => {
			emitter.emit('click', id);
			button.removeEventListener('click', on_click);
		}
		button.addEventListener('click', on_click);
	});

	return emitter;
}

function dialog_content(parent) {
	const content_wrapper = document.createElement('div');
	content_wrapper.className = 'content-wrapper';
	parent.appendChild(content_wrapper);
	return content_wrapper;
}

export function Dialog() {
	const parent = document.querySelector('body');
	const dialog = document.createElement('div');

	const content = dialog_content(dialog);
	const buttons = dialog_buttons(dialog, [{id: 'cancel', label: 'Cancel'}, {id: 'ok', label: 'Ok'}]);
	let about_to_close = noop;

	dialog.className = 'dialog';

	return {
		get content() {
			return content;
		},
		set content(c) {

		},
		set aboutToClose(fn) {
			if (is_function(fn)) {
				about_to_close = fn;
				return ;
			}
			throw new TypeError('argument must be a function');
		},
		run() {
			const terminate = () => {
				parent.removeChild(overlay(parent));
				parent.removeChild(dialog);
			};
			overlay(parent);
			parent.appendChild(dialog);
			dialog.style.left = `${(window.innerWidth - dialog.clientWidth)/2}px`;
			dialog.style.top = `${(window.innerHeight - dialog.clientHeight)/2}px`;
			return new Promise((resolve, reject) => {
				try {
					buttons.once('click', action => {
						terminate();
						resolve(about_to_close(action));
					});
				} catch (err) {
					terminate();
					reject(err);
				}
			});
		}
	};
}

export function Prompt(placeholder = '') {
	const dialog = Dialog();
	const input = document.createElement('input');
	input.type = 'text';
	input.placeholder = placeholder;
	dialog.content.appendChild(input);
	dialog.aboutToClose = (reason) => {
		if (reason === 'ok') {
			return input.value;
		}
	};
	return dialog;
}
