import ActionsPalette from 'editor/palette/actions-palette';
import BricksPalette from 'editor/palette/bricks-palette';

import View from 'ui/view';

export default function Palette() {
	const bricksPalette = BricksPalette();
	const actionsPalette = ActionsPalette();
	const palette = View({
		id: 'palette',
		tagName: 'form',
		onRender(view) {
			const el = view.el();
			el.appendChild(bricksPalette.render().el());
			el.appendChild(actionsPalette.render().el());
		}
	});

	actionsPalette.on('click', action => {
		palette.emit('action', action);
	});
	bricksPalette.on('click', color => {
		palette.emit('brick', color);
	});

	return palette;
}
