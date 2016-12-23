import BoundingBox from 'graphics/bounding-box';
import {completeAssign} from 'common/utils';

function SceneController(state) {
	return {
		get screen() {
			return state.screen;
		},
		get scale() {
			return state.scale;
		},
		add(child) {
			state.children.add(child);
			return this;
		},
		remove(child) {
			state.children.delete(child);
			return this;
		}
	};
}

function SceneRenderer(state) {
	const screen = state.screen;
	const {boundingBox} = BoundingBox(state);
	return {
		boundingBox,
		render() {
			const rect = boundingBox.relative;
			screen.save();

			screen.scale(state.scale);
			screen.translate(state.position);
			screen.clipRect(rect);

			screen.brush = state.backgroundColor;
			screen.fillRect(rect);

			for (let child of state.children) {
				child.render();
			}

			screen.restore();
		}
	};
}

export default function Scene(screen, rect, scale, backgroundColor = 'rgba(0, 0, 0, 0)') {
	const state = {
		backgroundColor,
		children: new Set(),
		position: rect.topLeft,
		size: rect.size,
		screen,
		scale
	};
	return completeAssign(
		{},
		SceneRenderer(state),
		SceneController(state)
	);
}
