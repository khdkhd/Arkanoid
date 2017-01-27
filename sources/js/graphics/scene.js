import {completeAssign} from 'common/utils';
import SceneObject from 'graphics/scene-object';

import constant from 'lodash.constant';
import remove from 'lodash.remove';
import is_nil from 'lodash.isnil';

export function SceneModel(scene, {backgroundColor = 'rgba(0, 0, 0, 0)', scale = 1, rect}) {
	if (is_nil(rect)) {
		rect = scene.boundingBox.relative;
	}
	return {
		backgroundColor,
		children:[],
		position: constant(rect.topLeft),
		scale,
		size: constant(rect.size)
	};
}

export function SceneController(state) {
	return {
		add(child) {
			remove(state.children, child);
			state.children.push(child);
			state.children.sort((a, b) => a.zIndex - b.zIndex);
			if (child.scene !== this) {
				child.scene = this;
			}
			return this;
		},
		remove(child) {
			remove(state.children, child);
			child.scene = null;
			return this;
		}
	};
}

export function SceneView(parent_scene, state) {
	return SceneObject(parent_scene, completeAssign({
		onRender(screen, scene, rect) {
			screen.brush = state.backgroundColor;
			screen.fillRect(rect);
			for (let child of state.children) {
				child.render(screen);
			}
		}
	}, state));
}

export default (parent_scene, options) => {
	const state = SceneModel(parent_scene, options);
	return completeAssign(
		SceneController(state),
		SceneView(parent_scene, state)
	);
}
