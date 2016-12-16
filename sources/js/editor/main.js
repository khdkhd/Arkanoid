import palette from 'editor/palette';
import editorView from 'editor/editor-view';

import Brick from 'game/brick';

import Rect from 'maths/rect';

import over_some from 'lodash.oversome';
import remove from 'lodash.remove';

const scene_size = editorView.scene.boundingBox.absolute.size;

const bricks = [];
const bricks_zone = Rect({x: 1, y: 1}, {
	width:  scene_size.width - 4,
	height: scene_size.height - 1
});

function match_position(position) {
	return brick => brick.position.equal(position);
}

function overlap(position) {
	const check = over_some(
		match_position(position.add({x: -1, y: 0})),
		match_position(position),
		match_position(position.add({x:  1, y: 0}))
	);
	return bricks.some(check) || !bricks_zone.contains(position);
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

palette.export = () => {
	return JSON.stringify(bricks.map(brick => {
		const {position, color} = brick;
		return {
			color,
			position: {x: position.x, y: position.y}
		};
	}));
};

editorView.render();
