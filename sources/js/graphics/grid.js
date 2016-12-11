import times from 'lodash.times';
export default function Grid(cols, rows, step, color, scene) {
	const grid ={
		render() {
			const {screen, scale} = scene;
			screen.save();
				screen.pen = {
					strokeStyle: color,
					lineWidth: 1/scale
				};

				// Vertical guides
				screen.save();
				times(cols, () => {
					screen.translate({x: step, y: 0});
					screen.drawLine({x: 0, y: 0}, {x: 0, y: rows*step});
				});
				screen.restore();

				// Horizontal guides
				screen.save();
				times(rows, () => {
					screen.translate({x: 0, y: step});
					screen.drawLine({x: 0, y: 0}, {x: cols*step, y: 0});
				});
				screen.restore();

			screen.restore();
		}
	}
	scene.add(grid);
	return grid;
}
