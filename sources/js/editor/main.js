import ActionsPalette from 'editor/actions-palette';
import BricksPalette from 'editor/bricks-palette';
import LevelEditorView from 'editor/level-editor-view';
import LevelModel from 'editor/level-model';

import Confirm from 'ui/dialog-confirm';
import Notice from 'ui/dialog-notice';
import Prompt from 'ui/dialog-prompt';

import cond from 'lodash.cond';
import is_nil from 'lodash.isnil';

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

const level = LevelModel();
const editor = LevelEditorView(level);
const bricksPalette = BricksPalette({
	el: document.querySelector('#palette #bricks')
});
const actionsPalette = ActionsPalette({
	el: document.querySelector('#palette #actions')
});

function import_level() {
	let level;
	upload()
		.then(d => {
			level = d;
			return Confirm({
				question: 'Are you sure you want to continue ? all changes will be lost.'
			}).run();
		})
		.then(confirmed => {
			if (confirmed) {
				editor.reset(level);
			}
		})
		.catch(err => {
			Notice(err).run();
		});
}

function export_level() {
	Prompt({
		placeholder: 'level.json',
		question: 'Please enter a filename:'
	}).run().then(value => {
		if (!is_nil(value)) {
			download(new Blob([level.toJSON()], {
				type: 'application/octet-stream'
			}), value.trim());
		}
	});
}

actionsPalette.on('click', cond([
	[action => action === 'export', export_level],
	[action => action === 'import', import_level]
]));
bricksPalette.on('click', color => {
	editor.setColor(color);
});

actionsPalette.render();
bricksPalette.render();
editor.render();
