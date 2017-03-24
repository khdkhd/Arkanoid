import {completeAssign} from 'common/utils';
import SceneObject from 'graphics/scene-object';

import flatten from 'lodash.flatten';
import remove from 'lodash.remove';

export function SceneModel(options) {
	return Object.assign({
		backgroundColor: 'rgba(0, 0, 0, 0)',
		sceneObjects: []
	}, options);
}

export function SceneController(state) {
	return {
		add(...sceneObjects) {
			for (let sceneObject of flatten(sceneObjects)) {
				remove(state.sceneObjects, sceneObject);
				state.sceneObjects.push(sceneObject);
				state.sceneObjects.sort((a, b) => a.zIndex() - b.zIndex());
				if (sceneObject.scene() !== this) {
					sceneObject.setScene(this);
				}
			}
			return this;
		},
		remove(...sceneObjects) {
			for (let sceneObject of flatten(sceneObjects)) {
				remove(state.sceneObjects, sceneObject);
				sceneObject.setScene(null);
			}
			return this;
		},
		reset() {
			return this.remove(state.sceneObjects);
		},
	};
}

export function SceneView(coordinates, state) {
	return SceneObject(coordinates, Object.assign(state, {
		onSceneChanged() {},
		onRender(screen, scene, rect) {
			screen.brush = state.backgroundColor;
			screen.fillRect(rect);
			for (let sceneObject of state.sceneObjects) {
				sceneObject.render(screen);
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
