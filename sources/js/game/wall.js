import Vector from 'maths/vector';
import SceneObject from 'graphics/scene-object';

function WallBrush(start, stop, screen) {
	return {fillStyle: screen.createLinearGradient(start, stop, [
		{pos: 0,    color: '#6d6d6d'},
		{pos: .125, color: '#6f6f6d'},
		{pos: .375, color: '#c8c8c8'},
		{pos: .500, color: '#8d8d8d'},
		{pos: .625, color: '#7c7c7c'},
		{pos: .750, color: '#7c7c7c'},
		{pos: .875, color: '#555555'},
		{pos: 1,    color: '#555555'}
	])};
}

function Wall(state) {
	return SceneObject({
		onRender(scene) {
			const {screen} = scene;
			const brush = WallBrush(state.gradientStart, state.gradientStop, screen);
			screen.save();
			screen.translate(state.position);
			screen.brush = brush;
			screen.fillPath(state.path);
			screen.restore();
		}
	});
}

function VerticalWall({x, y}, gradientStart, gradientStop) {
	return Wall({
		gradientStart,
		gradientStop,
		path: new Path2D(`
			M ${ 1/16} 0
			L ${15/16} 0
			L ${15/16} 1
			L ${ 1/16} 1
			L ${ 1/16} 0
		`),
		position: Vector({x, y})
	});
}

export function VerticalLeftWall({x, y}) {
	return VerticalWall({x, y}, {x: 0, y: 0}, {x: 1, y: 0});
}

export function VerticalRightWall({x, y}) {
	return VerticalWall({x, y}, {x: 1, y: 0}, {x: 0, y: 0});
}

export function VerticalTopLeftWall({x, y}) {
	return Wall({
		gradientStart: {x: 0, y: 0},
		gradientStop: {x: 1, y: 0},
		path: new Path2D(`
			M ${ 1/16} ${ 1/16}
			L ${15/16} ${15/16}
			L ${15/16} 1
			L ${ 1/16} 1
			L ${ 1/16} ${ 1/16}
		`),
		position: Vector({x, y}),
	});
}

export function VerticalTopRightWall({x, y}) {
	return Wall({
		gradientStart: {x: 1, y: 0},
		gradientStop: {x: 0, y: 0},
		path: new Path2D(`
			M ${15/16} ${ 1/16}
			L ${15/16} 1
			L ${ 1/16} 1
			L ${ 1/16} ${15/16}
			L ${15/16} ${ 1/16}
		`),
		position: Vector({x, y})
	});
}

export function HorizontalWall({x, y}) {
	return Wall({
		gradientStart: {x: 0, y: 0},
		gradientStop: {x: 0, y: 1},
		path: new Path2D(`
			M 0 ${ 1/16}
			L 1 ${ 1/16}
			L 1 ${15/16}
			L 0 ${15/16}
			L 0 ${ 1/16}
		`),
		position: Vector({x, y})
	});
}

export function HorizontalLeftWall({x, y}) {
	return Wall({
		gradientStart: {x: 0, y: 0},
		gradientStop: {x: 0, y: 1},
		path: new Path2D(`
			M ${1/16} ${ 1/16}
			L 1 ${ 1/16}
			L 1 ${15/16}
			L ${15/16} ${15/16}
			L ${1/16} ${ 1/16}
		`),
		position: Vector({x, y})
	});
}

export function HorizontalRightWall({x, y}) {
	return Wall({
		gradientStart: {x: 0, y: 0},
		gradientStop: {x: 0, y: 1},
		path: new Path2D(`
			M 0 ${ 1/16}
			L ${15/16} ${ 1/16}
			L ${ 1/16} ${15/16}
			L 0 ${15/16}
			L 0 ${ 1/16}
		`),
		position: Vector({x, y})
	});
}
