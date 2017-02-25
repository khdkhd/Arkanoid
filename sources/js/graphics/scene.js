import {completeAssign} from 'common/utils';
import SceneObject from 'graphics/scene-object';

import remove from 'lodash.remove';

export function SceneModel(options) {
	return Object.assign({
		backgroundColor: 'rgba(0, 0, 0, 0)',
		children:[]
	}, options);
}

export function SceneController({children}) {
	return {
		add(...objects) {
			for (let child of objects) {
				remove(children, child);
				children.push(child);
				children.sort((a, b) => a.zIndex() - b.zIndex());
				if (child.scene() !== this) {
					child.setScene(this);
				}
			}
			return this;
		},
		remove(child) {
			remove(children, child);
			child.setScene(null);
			return this;
		},
	};
}

export function SceneView(coordinates, state) {
	return SceneObject(coordinates, Object.assign(state, {
		onSceneChanged() {},
		onRender(screen, scene, rect) {
			screen.brush = state.backgroundColor;
			screen.fillRect(rect);
			for (let child of state.children) {
				child.render(screen);
			}
		}
	}));
}

export default (coordinates, options) => {
	const state = SceneModel(options);
	return completeAssign(
		{},
		coordinates,
		SceneView(coordinates, state),
		SceneController(state)
	);
}
