import Vector from 'vector';

const wall = new Path2D(`
	M 0 0
	L 1 0
	L 1 1
	L 0 1
	L 0 0
`);

const h_left_wall = new Path2D(`
	M 0 0
	L 1 0
	L 1 1
	L 0 0
`);

const h_right_wall = new Path2D(`
	M 0 0
	L 1 0
	L 0 1
	L 0 0
`);

const v_left_wall = new Path2D(`
	M 0 0
	L 1 1
	L 0 1
	L 0 0
`);

const v_right_wall = new Path2D(`
	M 1 0
	L 1 1
	L 0 1
	L 0 1
`);

export function HorizontalWall({x, y}) {
	const pos = Vector({x, y});
	return {
		get pos() {
			return pos;
		},
		draw(screen) {
			const gradient = screen.createLinearGradient(Vector.Null, Vector.Down, [
				{pos: 0,    color: '#6d6d6d'},
				{pos: .125, color: '#6f6f6d'},
				{pos: .375, color: '#c8c8c8'},
				{pos: .500, color: '#8d8d8d'},
				{pos: .625, color: '#7c7c7c'},
				{pos: .750, color: '#7c7c7c'},
				{pos: .875, color: '#555555'},
				{pos: 1,    color: '#555555'}
			]);
			screen.save();
			screen.brush = {fillStyle: gradient};
			screen.fillPath(wall);
			screen.restore();
		}
	};
}

export function HorizontalLeftWall({x, y}) {
	const pos = Vector({x, y});
	return {
		get pos() {
			return pos;
		},
		draw(screen) {
			const gradient = screen.createLinearGradient(Vector.Null, Vector.Down, [
				{pos: 0,    color: '#6d6d6d'},
				{pos: .125, color: '#6f6f6d'},
				{pos: .375, color: '#c8c8c8'},
				{pos: .500, color: '#8d8d8d'},
				{pos: .625, color: '#7c7c7c'},
				{pos: .750, color: '#7c7c7c'},
				{pos: .875, color: '#555555'},
				{pos: 1,    color: '#555555'}
			]);
			screen.save();
			screen.brush = {fillStyle: gradient};
			screen.fillPath(h_left_wall);
			screen.restore();
		}
	};
}

export function HorizontalRightWall({x, y}) {
	const pos = Vector({x, y});
	return {
		get pos() {
			return pos;
		},
		draw(screen) {
			const gradient = screen.createLinearGradient(Vector.Null, Vector.Down, [
				{pos: 0,    color: '#6d6d6d'},
				{pos: .125, color: '#6f6f6d'},
				{pos: .375, color: '#c8c8c8'},
				{pos: .500, color: '#8d8d8d'},
				{pos: .625, color: '#7c7c7c'},
				{pos: .750, color: '#7c7c7c'},
				{pos: .875, color: '#555555'},
				{pos: 1,    color: '#555555'}
			]);
			screen.save();
			screen.brush = {fillStyle: gradient};
			screen.fillPath(h_right_wall);
			screen.restore();
		}
	};
}

export function VerticalLeftWall({x, y}) {
	const pos = Vector({x, y});
	return {
		get pos() {
			return pos;
		},
		draw(screen) {
			const gradient = screen.createLinearGradient(Vector.Null, Vector.Right, [
				{pos: 0,    color: '#6d6d6d'},
				{pos: .125, color: '#6f6f6d'},
				{pos: .375, color: '#c8c8c8'},
				{pos: .500, color: '#8d8d8d'},
				{pos: .625, color: '#7c7c7c'},
				{pos: .750, color: '#7c7c7c'},
				{pos: .875, color: '#555555'},
				{pos: 1,    color: '#555555'}
			]);
			screen.save();
			screen.brush = {fillStyle: gradient};
			screen.fillPath(wall);
			screen.restore();
		}
	};
}

export function VerticalTopLeftWall({x, y}) {
	const pos = Vector({x, y});
	return {
		get pos() {
			return pos;
		},
		draw(screen) {
			const gradient = screen.createLinearGradient(Vector.Null, Vector.Right, [
				{pos: 0,    color: '#6d6d6d'},
				{pos: .125, color: '#6f6f6d'},
				{pos: .375, color: '#c8c8c8'},
				{pos: .500, color: '#8d8d8d'},
				{pos: .625, color: '#7c7c7c'},
				{pos: .750, color: '#7c7c7c'},
				{pos: .875, color: '#555555'},
				{pos: 1,    color: '#555555'}
			]);
			screen.save();
			screen.brush = {fillStyle: gradient};
			screen.fillPath(v_left_wall);
			screen.restore();
		}
	};
}

export function VerticalRightWall({x, y}) {
	const pos = Vector({x, y});
	return {
		get pos() {
			return pos;
		},
		draw(screen) {
			const gradient = screen.createLinearGradient(Vector.Null, Vector.Right, [
				{pos: 1 - 1,    color: '#555555'},
				{pos: 1 - .875, color: '#555555'},
				{pos: 1 - .625, color: '#7c7c7c'},
				{pos: 1 - .750, color: '#7c7c7c'},
				{pos: 1 - .500, color: '#8d8d8d'},
				{pos: 1 - .375, color: '#c8c8c8'},
				{pos: 1 - .125, color: '#6f6f6d'},
				{pos: 1 - 0,    color: '#6d6d6d'},
			]);
			screen.save();
			screen.brush = {fillStyle: gradient};
			screen.fillPath(wall);
			screen.restore();
		}
	};
}

export function VerticalTopRightWall({x, y}) {
	const pos = Vector({x, y});
	return {
		get pos() {
			return pos;
		},
		draw(screen) {
			const gradient = screen.createLinearGradient(Vector.Null, Vector.Right, [
				{pos: 1 - 1,    color: '#555555'},
				{pos: 1 - .875, color: '#555555'},
				{pos: 1 - .625, color: '#7c7c7c'},
				{pos: 1 - .750, color: '#7c7c7c'},
				{pos: 1 - .500, color: '#8d8d8d'},
				{pos: 1 - .375, color: '#c8c8c8'},
				{pos: 1 - .125, color: '#6f6f6d'},
				{pos: 1 - 0,    color: '#6d6d6d'},
			]);
			screen.save();
			screen.brush = {fillStyle: gradient};
			screen.fillPath(v_right_wall);
			screen.restore();
		}
	};
}
