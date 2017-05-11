import {
	topLargeLeft,
	topLargeMiddle,
	topLargeRight,
	topLeft,
	topRight,
	top,
	vertLargeBottom,
	vertLargeMiddle,
	vertLargeTop,
	vert
} from 'game/entities/wall/path';
import Coordinates from 'graphics/coordinates';
import SceneObject from 'graphics/scene-object';

import cond from 'lodash.cond';
import constant from 'lodash.constant';
import times from 'lodash.times';

export function WallModel({x, y, type}) {
	const WallPaths = {
		[Wall.Type.TopLargeLeft]: topLargeLeft,
		[Wall.Type.TopLargeMiddle]: topLargeMiddle,
		[Wall.Type.TopLargeRight]: topLargeRight,
		[Wall.Type.TopLeft]: topLeft,
		[Wall.Type.TopRight]: topRight,
		[Wall.Type.Top]: top,
		[Wall.Type.VertLargeBottom]: vertLargeBottom,
		[Wall.Type.VertLargeMiddle]: vertLargeMiddle,
		[Wall.Type.VertLargeTop]: vertLargeTop,
		[Wall.Type.Vert]: vert
	};
	return {
		coordinates: Coordinates({width: 1, height: 1}, {x, y}),
		paths: WallPaths[type]
	};
}

export function WallView(state) {
	return SceneObject(state.coordinates, {
		onRender(screen) {
			for (let [path, color] of state.paths) {
				screen.brush = color;
				screen.fillPath(path);
			}
		}
	});
}

export function Wall({x, y}, type) {
	const state = WallModel({x, y, type})
	return WallView(state);
}

Object.defineProperty(Wall, 'Type', {
	writable: false,
	value: Object.freeze({
		TopLargeLeft: Symbol('Wall.TopLargeLeft'),
		TopLargeMiddle: Symbol('Wall.TopLargeMiddle'),
		TopLargeRight: Symbol('Wall.TopLargeRight'),
		TopLeft: Symbol('Wall.TopLeft'),
		TopRight: Symbol('Wall.TopRight'),
		Top: Symbol('Wall.Top'),
		VertLargeBottom: Symbol('Wall.VertLargeBottom'),
		VertLargeMiddle: Symbol('Wall.VertLargeMiddle'),
		VertLargeTop: Symbol('Wall.VertLargeTop'),
		Vert: Symbol('Wall.Vert')
	})
});

export default function createWalls(cols, rows) {
	return [].concat(
		times(cols + 1, cond([
			[x => x === 0,        x => Wall({x, y: 0}, Wall.Type.TopLeft)],
			[x => x === 6,        x => Wall({x, y: 0}, Wall.Type.TopLargeLeft)],
			[x => x === 7,        x => Wall({x, y: 0}, Wall.Type.TopLargeMiddle)],
			[x => x === 8,        x => Wall({x, y: 0}, Wall.Type.TopLargeRight)],
			[x => x === cols - 6, x => Wall({x, y: 0}, Wall.Type.TopLargeRight)],
			[x => x === cols - 7, x => Wall({x, y: 0}, Wall.Type.TopLargeMiddle)],
			[x => x === cols - 8, x => Wall({x, y: 0}, Wall.Type.TopLargeLeft)],
			[x => x === cols,     x => Wall({x, y: 0}, Wall.Type.TopRight)],
			[constant(true),      x => Wall({x, y: 0}, Wall.Type.Top)]
		])),
		times(rows, cond([
			[y => y%5 === 0,      y => Wall({x: 0, y: y + 1}, Wall.Type.VertLargeTop)],
			[y => y%5 === 1,      y => Wall({x: 0, y: y + 1}, Wall.Type.VertLargeMiddle)],
			[y => y%5 === 2,      y => Wall({x: 0, y: y + 1}, Wall.Type.VertLargeBottom)],
			[constant(true),      y => Wall({x: 0, y: y + 1}, Wall.Type.Vert)]
		])),
		times(rows, cond([
			[y => y%5 === 0,      y => Wall({x: cols, y: y + 1}, Wall.Type.VertLargeTop)],
			[y => y%5 === 1,      y => Wall({x: cols, y: y + 1}, Wall.Type.VertLargeMiddle)],
			[y => y%5 === 2,      y => Wall({x: cols, y: y + 1}, Wall.Type.VertLargeBottom)],
			[constant(true),      y => Wall({x: cols, y: y + 1}, Wall.Type.Vert)]
		]))
	);
}
