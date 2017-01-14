import is_nil from 'lodash.isnil';
import noop from 'lodash.noop';

import {completeAssign} from 'common/utils';
import BoundingBox from 'graphics/bounding-box';

export const SceneObjectModel = state => completeAssign({
	alignCenterToOrigin: false,
	onRender: noop,
	onSceneChanged: noop,
	renderEnabled: true,
	scene: null,
	zIndex: 0
}, BoundingBox(state), state);

export default (state) => {
	state = SceneObjectModel(state);
	const object = {
		set zIndex(value) {
			if (state.zIndex !== value) {
				state.zIndex = value;
				if (!is_nil(state.scene)) {
					// make the scene to sort its children
					state.scene.add(this);
				}
			}
		},
		get zIndex() {
			return state.zIndex;
		},
		set scene(scene) {
			if (!is_nil(state.scene)) {
				state.scene.remove(this);
				state.scene = null;
			}
			if (!is_nil(scene) && scene !== state.scene) {
				state.scene = scene;
				scene.add(this);
				state.onSceneChanged(scene);
			}
		},
		get scene() {
			return state.scene;
		},
		toggleRender(enabled){
			if(is_nil(enabled)){
				state.renderEnabled = !state.renderEnabled;
			} else {
				state.renderEnabled = enabled;
			}
		},
		render() {
			if (state.renderEnabled) {
				const screen = state.scene.screen;
				screen.save();
				screen.translate(state.boundingBox.absolute.topLeft);
				state.onRender(state.scene);
				screen.restore();
			}
		},
		get boundingBox() {
			return state.boundingBox;
		}
	};
	if (is_nil(state.scene)) {
		object.scene = state.scene;
	}
	return object;
}
