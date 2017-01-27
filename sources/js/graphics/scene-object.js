import is_nil from 'lodash.isnil';
import is_number from 'lodash.isnumber';
import noop from 'lodash.noop';
import pick from 'lodash.pick';

import {completeAssign} from 'common/utils';
import BoundingBox from 'graphics/bounding-box';

function normalize_scale(state) {
	const {scale} = state;
	state.scale = is_number(scale) ? {x: scale, y: scale} : scale;
	return state;
}

export const SceneObjectModel = state => normalize_scale(completeAssign({
	alignCenterToOrigin: false,
	onRender: noop,
	onSceneChanged: noop,
	renderEnabled: true,
	scale: 1,
	scene: null,
	zIndex: 0,
}, BoundingBox(state), state));

export default (parent_scene, options) => {
	const state = SceneObjectModel(pick(options, [
		'alignCenterToOrigin',
		'onRender',
		'onSceneChanged',
		'renderEnabled',
		'position',
		'scale',
		'size',
		'zIndex'
	]));
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
				const tmp = state.scene;
				state.scene = null;
				tmp.remove(this);
			}
			if (!is_nil(scene) && scene !== state.scene) {
				state.scene = scene;
				scene.add(this);
				state.onSceneChanged.call(this, scene);
			}
		},
		get scene() {
			return state.scene;
		},
		get scale() {
			return state.scale;
		},
		set scale(f) {
			state.scale = is_number(f) ? {x: f, y: f} : f;
		},
		get size() {
			return {
				width: state.size.width,
				height: state.size.height
			};
		},
		set size({width, height}) {
			state.size.width = width;
			state.size.height = height;
		},
		toggleRender(enabled) {
			if(is_nil(enabled)) {
				state.renderEnabled = !state.renderEnabled;
			} else {
				state.renderEnabled = enabled;
			}
		},
		render(screen) {
			if (state.renderEnabled) {
				const rect = state.boundingBox.relative;
				const pos = state.position();
				screen.save();
				screen.scale = state.scale;
				screen.translate(pos);
				screen.clipRect(rect);
				state.onRender.call(this, screen, state.scene, rect);
				screen.restore();
			}
		},
		get boundingBox() {
			return state.boundingBox;
		}
	};
	object.scene = parent_scene;
	return object;
}
