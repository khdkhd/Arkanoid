import is_nil from 'lodash.isnil';
import noop from 'lodash.noop';

export default ({onRender, onSceneChanged = noop, zIndex = 0}) => {
	const state = Object.assign({
		renderEnabled: true
	}, {scene: null, onRender, zIndex});

	return {
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
				onSceneChanged(scene);
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
				onRender(state.scene);
				screen.restore();
			}
		}
	};
}
