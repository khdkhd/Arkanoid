import {EventEmitter} from 'events';

import is_function from 'lodash.isfunction';
import is_nil from 'lodash.isnil';
import is_string from 'lodash.isstring';
import cond from 'lodash.cond';
import constant from 'lodash.constant';
import noop from 'lodash.noop';
import uniq from 'lodash.uniq';

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

function dialog_init_buttons(parent, buttons_descriptors) {
	const buttons_wrapper = document.createElement('ul');
	const emitter = new EventEmitter();

	parent.appendChild(buttons_wrapper);
	buttons_wrapper.className = 'buttons-wrapper';
	buttons_descriptors.forEach(({role, label}) => {
		const button = dialog_button(buttons_wrapper, role, label);
		const on_click = () => {
			emitter.emit('click', role);
			button.removeEventListener('click', on_click);
		}
		button.addEventListener('click', on_click);
	});

	return emitter;
}

function dialog_init_content(parent, content) {
	const content_wrapper = document.createElement('div');
	content_wrapper.className = 'content-wrapper';
	if (is_string(content)) {
		parent.innerHTML = content;
	} else {
		content_wrapper.appendChild(content);
	}
	parent.appendChild(content_wrapper);
	return content_wrapper;
}

export function Dialog({
	aboutToClose = noop,
	className = [],
	content,
	id = ''
} = {}) {
	const parent = document.querySelector('body');
	const dialog = document.createElement('div');

	dialog_init_content(dialog, content);
	const buttons_ = dialog_init_buttons(dialog, [{role: 'cancel', label: 'Cancel'}, {role: 'ok', label: 'Ok'}]);

	dialog.className = uniq([].concat(className, 'dialog')).join(' ');
	dialog.id = id;

	return {
		set aboutToClose(fn) {
			if (is_function(fn)) {
				aboutToClose = fn;
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
					buttons_.once('click', action => {
						terminate();
						resolve(aboutToClose(action));
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
	const input = document.createElement('input');

	input.type = 'text';
	input.placeholder = placeholder;

	return Dialog({
		aboutToClose: (role) => {
			if (role === 'ok') {
				return input.value;
			}
		},
		className: 'prompt',
		content: input
	});
}

export function Confirm(message) {
	return Dialog({
		aboutToClose: (role) => {
			return role === 'ok';
		},
		className: 'confirm',
		content: `<p>${message}</p>`
	});
}

const NOTICE_MESSAGE = 0;
const NOTICE_WARNING = 1;
const NOTICE_ERROR = 2;

const notice_icon = cond([
	[status => status === NOTICE_WARNING, constant('<i class="fa fa-times-circle"></i>')],
	[status => status === NOTICE_ERROR,   constant('<i class="fa fa-exclamation-circle"></i>')],
	[constant(true), constant('')]
]);

export function Notice(message, status = NOTICE_MESSAGE) {
	return Dialog({
		className: 'notice',
		content: `<p>${notice_icon(status)}${message}</p>`
	});
}

Notice.Error = NOTICE_ERROR;
Notice.Warning = NOTICE_WARNING;
Notice.Message = NOTICE_MESSAGE;
