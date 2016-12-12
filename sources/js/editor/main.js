import Brick from 'game/brick';

import palette from 'editor/palette';
import editorView from 'editor/editor-view';

import remove from 'lodash.remove';

const bricks = [];

function match_position(position) {
	return brick => brick.position.equal(position);
}

editorView.on('click', position => {
	const scene = editorView.scene;
	const color = palette.color;

	if (palette.mode === 'add') {
		bricks.push(Brick(position, color, 1, scene));
	} else {
		remove(bricks, match_position(position))
			.forEach(brick => scene.remove(brick));
	}

	editorView.render();
});
palette.onExport = () => {
	return JSON.stringify(bricks.map(brick => {
		const {position, color} = brick;
		return {
			color,
			position: {x: position.x, y: position.y}
		};
	}));
};

editorView.render();
