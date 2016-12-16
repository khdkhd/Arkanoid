import {Confirm, Prompt, Notice} from 'ui/dialog';

import is_function from 'lodash.isfunction';
import is_nil from 'lodash.isnil';

const palette = document.querySelector('#palette');
const export_button = palette.querySelector('#export');
const import_button = palette.querySelector('#import');

let export_callback = () => {
	throw new Error('nothing to export');
};

let import_callback = () => {
	throw new Error('nothing to export');
};

function download(blob, filename) {
	const a = document.createElement('a');
	a.download = filename;
	a.href = URL.createObjectURL(blob);
	a.click();
}

function upload() {
	return new Promise((resolve, reject) => {
		const input = document.createElement('input');
		input.addEventListener('change', input_ev => {
			const file = input_ev.target.files[0];
			const reader = new FileReader();
			reader.onload = reader_ev => {
				try {
					resolve(JSON.parse(reader_ev.target.result));
				} catch (err) {
					reject(err);
				}
			}
			reader.readAsText(file);
		});
		input.type = 'file';
		input.click();
	});
}

export_button.addEventListener('click', ev => {
	ev.preventDefault();
	ev.stopPropagation();
	const default_filename = 'level.json';
	Prompt(default_filename).run().then(value => {
		if (!is_nil(value)) {
			download(new Blob([export_callback()], {
				type: 'application/octet-stream'
			}), `${(value || default_filename).trim()}`);
		}
	});
});

import_button.addEventListener('click', ev => {
	ev.preventDefault();
	ev.stopPropagation();
	let data;
	upload()
		.then(d => {
			data = d;
			return Confirm('Are you sure you want to continue ? all changes will be lost.').run();
		})
		.then(confirmed => {
			if (confirmed) {
				import_callback(data);
			}
		})
		.catch(err => {
			Notice(err.message, Notice.Error).run();
		});
});

export default {
	get color() {
		const brick = palette.querySelector('#bricks input:checked');
		return brick.id;
	},
	get mode() {
		const mode = palette.querySelector('#modes input:checked');
		return mode.id;
	},
	set export(fn) {
		if (!is_function(fn)) {
			throw TypeError('argument must be a function');
		}
		export_callback = fn;
	},
	set import(fn) {
		if (!is_function(fn)) {
			throw TypeError('argument must be a function');
		}
		import_callback = fn;
	}
};
