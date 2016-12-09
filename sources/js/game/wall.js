import Vector from 'maths/vector';

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
	const {screen} = state.scene;
	const brush = WallBrush(state.gradientStart, state.gradientStop, screen);
	const wall = {
		get position() {
			return state.position;
		},
		render() {
			screen.save();
			screen.translate(state.position);
			screen.brush = brush;
			screen.fillPath(state.path);
			screen.restore();
		}
	};
	state.scene.add(wall);
	return wall;
}

function VerticalWall({x, y}, gradientStart, gradientStop, scene) {
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
		position: Vector({x, y}),
		scene
	});
}

export function VerticalLeftWall({x, y}, scene) {
	return VerticalWall({x, y}, {x: 0, y: 0}, {x: 1, y: 0}, scene);
}

export function VerticalRightWall({x, y}, scene) {
	return VerticalWall({x, y}, {x: 1, y: 0}, {x: 0, y: 0}, scene);
}

export function VerticalTopLeftWall({x, y}, scene) {
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
		scene
	});
}

export function VerticalTopRightWall({x, y}, scene) {
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
		position: Vector({x, y}),
		scene
	});
}

export function HorizontalWall({x, y}, scene) {
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
		position: Vector({x, y}),
		scene,
	});
}

export function HorizontalLeftWall({x, y}, scene) {
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
		position: Vector({x, y}),
		scene
	});
}

export function HorizontalRightWall({x, y}, scene) {
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
		position: Vector({x, y}),
		scene
	});
}
