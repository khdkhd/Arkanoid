import Palette from 'editor/palette';
import LevelView from 'editor/level-view';

import {default as createBricks} from 'game/entities/brick';

import Confirm from 'ui/dialog/confirm';
import Notice from 'ui/dialog/notice';
import Prompt from 'ui/dialog/prompt';
import View from 'ui/view';

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

function import_level(level) {
	let serialized_level;
	upload()
		.then(d => {
			serialized_level = d;
			return Confirm({
				question: 'Are you sure you want to continue ? all changes will be lost.'
			}).run();
		})
		.then(confirmed => {
			if (confirmed) {
				level.reset(createBricks(serialized_level));
			}
		})
		.catch(err => {
			Notice(err).run();
		});
}

function export_level(level) {
	Prompt({
		placeholder: 'level.json',
		question: 'Please enter a filename:'
	}).run().then(value => {
		if (!is_nil(value)) {
			const bricks = level.serialize();
			download(new Blob([JSON.stringify(bricks)], {
				type: 'application/octet-stream'
			}), value.trim());
		}
	});
}

export default function Editor({level}) {
	const levelView = LevelView({level});
	const palette = Palette();
	const view = View({
		el: document.querySelector('#content-wrapper'),
		onRender(view) {
			view.el().appendChild(palette.render().el());
			view.el().appendChild(levelView.render().el());
		}
	});
	let brickColor;

	palette
		.on('brick', color => brickColor = color)
		.on('action', cond([
			[action => action === 'export', () => export_level(level)],
			[action => action === 'import', () => import_level(level)],
			[action => action === 'play',   () => view.emit('play')]
		]));

	levelView
		.on('click', pos => {
			if (level.containsBrickAt(pos)) {
				// Ok, we know that there is some bricks under the drop mark.
				// But we want to remove the one which is exactly under the
				// given position.
				const brick = level.brickAt(pos);
				if (!is_nil(brick)) {
					brick.destroy();
				}
			} else if (!is_nil(brickColor)) {
				level.create(pos, brickColor, 1);
			}
		});


	return view;
}
