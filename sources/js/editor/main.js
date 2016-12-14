import Brick from 'game/brick';

import palette from 'editor/palette';
import editorView from 'editor/editor-view';

import over_some from 'lodash.oversome';
import remove from 'lodash.remove';

const bricks = [];

function match_position(position) {
	return brick => brick.position.equal(position);
}

function overlap(position) {
	const check = over_some(
		match_position(position.add({x: -1, y: 0})),
		match_position(position),
		match_position(position.add({x:  1, y: 0}))
	);
	return bricks.some(check);
}

editorView.on('click', position => {
	const scene = editorView.scene;
	const color = palette.color;

	if (palette.mode === 'add' && !overlap(position)) {
		bricks.push(Brick(position, color, 1, scene));
	} else {
		const match = over_some(
			match_position(position),
			match_position(position.add({x: -1, y: 0}))
		);
		remove(bricks, match).forEach(brick => scene.remove(brick));
	}
	editorView.render();
});
editorView.overlap = overlap;

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
