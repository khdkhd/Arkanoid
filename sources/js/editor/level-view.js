import MouseDropMark from 'editor/mouse-drop-mark';

import createWalls from 'game/entities/wall';

import Coordinates from 'graphics/coordinates';
import Grid from 'graphics/grid';
import Scene from 'graphics/scene';

import Vector from 'maths/vector';

import {default as GraphicsView, MouseEventsHandler} from 'ui/graphics-view';
import {eventCoordinates} from 'ui/utils';

const editor_bg_color = 'hsl(210, 50%, 13%)';
const editor_grid1_color = 'hsl(210, 50%, 25%)';
const editor_grid2_color = 'hsl(210, 50%, 33%)';

function event_coordinates(el, ev, scale) {
	const {x, y} = eventCoordinates(el, ev);
	return Vector({
		x: Math.floor(x/scale - .25),
		y: Math.floor(y/scale - .25)
	}).add({x: -1, y: -1});
}

export default function LevelView({level}) {
	const columns = level.columns();
	const rows = level.rows();
	const scene = Scene(Coordinates({
		width: columns,
		height: rows
	}, Vector.Null));
	const editorSize = {
		width:  columns - 2,
		height: rows - 1
	};
	const editorScene = Scene(Coordinates(editorSize, {x: 1, y: 1}), {
		backgroundColor: editor_bg_color
	});
	const levelScene  = Scene(Coordinates(editorSize, {x: 0, y: 0}), {
		backgroundColor: 'rgba(0, 0, 0, 0)'
	});
	const mouseDropMark = MouseDropMark();

	scene.add(
		createWalls(columns - 1, rows),
		editorScene.add(
			Grid( columns - 2,     rows - 1,    1, editor_grid1_color),
			Grid((columns - 2)/2, (rows - 1)/2, 2, editor_grid2_color),
			levelScene,
			mouseDropMark
		)
	);
	return GraphicsView({
		id: 'screen',
		onBeforeRender(screen) {
			scene.setScale(level.scale());
			screen.reset()
				.setBackgroundColor('#123')
				.setSize(level.size())
				.add(scene);
		},
		domEvents: MouseEventsHandler({
			onClick(view, ev) {
				const pos = event_coordinates(view.el(), ev, level.scale());
				if (levelScene.localRect().contains(pos)) {
					view.emit('click', pos);
				}
			},
			onMouseMove(view, ev) {
				const el = view.el();
				mouseDropMark.setPosition(event_coordinates(el, ev, level.scale()));
				view.render();
			}
		}),
		modelEvents: {
			changed(attr, value, view) {
				if (attr === 'size') {
					view.render();
				}
			},
			itemAdded(brick, view) {
				brick.setZIndex(1);
				levelScene.add(brick);
				view.render();
			},
			itemDestroyed(bricks, view) {
				levelScene.remove(bricks);
				view.render();
			}
		},
		model: level
	});
}
