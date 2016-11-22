export default function drawGrid(cols, rows, screen, scale_factor, {line_width = 1, color = 'red'}) {
	screen.save();
	screen.translate({x: -.5, y: -.5});
	screen.scale(scale_factor);
	screen.pen = {
		strokeStyle: color,
		lineWidth: line_width/scale_factor
	}
	for (let col = 0; col < cols; ++col) {
		screen.drawLine({x: col, y: 0}, {x: col, y: rows});
	}
	for (let row = 0; row < rows; ++row) {
		screen.drawLine({x: 0, y: row}, {x: cols, y: row});
	}
	screen.restore();
}
