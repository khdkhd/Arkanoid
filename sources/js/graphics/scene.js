import BoundingBox from 'graphics/bounding-box';
import {completeAssign} from 'common/utils';
import remove from 'lodash.remove';

function SceneController(state) {
	return {
		get screen() {
			return state.screen;
		},
		get scale() {
			return state.scale;
		},
		add(child) {
			remove(state.children, child);
			state.children.push(child);
			state.children.sort((a, b) => a.zIndex - b.zIndex);
		},
		remove(child) {
			remove(state.children, child);
			return this;
		}
	};
}

function SceneRenderer(state) {
	const {boundingBox} = BoundingBox(state);
	return {
		boundingBox,
		render(screen) {
			const rect = boundingBox.relative;
			screen.save();

			screen.scale(state.scale);
			screen.translate(state.position);
			screen.clipRect(rect);

			screen.brush = state.backgroundColor;
			screen.fillRect(rect);

			for (let child of state.children) {
				child.render(screen);
			}

			screen.restore();
		}
	};
}

export default function Scene(screen, rect, scale, backgroundColor = 'rgba(0, 0, 0, 0)') {
	const state = {
		backgroundColor,
		children:[],
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
