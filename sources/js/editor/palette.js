import is_function from 'lodash.isfunction';

const palette = document.querySelector('#palette');
const export_button = palette.querySelector('#export');

let export_callback = () => {
	throw new Error('nothing to export');
};

function download(blob, filename) {
	const a = document.createElement('a');
	a.download = filename;
	a.href = URL.createObjectURL(blob);
	a.click();
}

export_button.addEventListener('click', ev => {
	ev.preventDefault();
	ev.stopPropagation();
	download(new Blob([export_callback()], {
		type: 'application/octet-stream'
	}), 'level-data.json');
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
	set onExport(fn) {
		if (!is_function(fn)) {
			throw TypeError('argument must be a function');
		}
		export_callback = fn;
	}
};
