import is_nil from 'lodash.isnil';
import is_number from 'lodash.isnumber';
import noop from 'lodash.noop';

function normalize_scale(scale) {
	if (is_nil(scale)) {
		scale = 1;
	}
	return is_number(scale) ? {x: scale, y: scale} : scale;
}

export default (coordinates, options) => {
	const onRender = is_nil(options.onRender) ? noop : options.onRender;
	const onSceneChanged = is_nil(options.onSceneChanged) ? noop : options.onSceneChanged;
	let scale = normalize_scale(options.scale);
	let scene = null;
	let visible = is_nil(options.visible) ? true : options.visible;
	let zIndex = is_nil(options.zIndex) ? 0 : options.zIndex;
	return {
		zIndex() {
			return zIndex;
		},
		setZIndex(value) {
			if (zIndex !== value) {
				zIndex = value;
				if (!is_nil(scene)) {
					// make the scene to sort its children
					scene.add(this);
				}
			}
			return this;
		},
		scene() {
			return scene;
		},
		setScene(s) {
			if (!is_nil(scene)) {
				const tmp = scene;
				scene = null;
				tmp.remove(this);
			}
			if (!is_nil(s) && scene !== s) {
				scene = s;
				scene.add(this);
				onSceneChanged.call(this, scene);
			}
			return this;
		},
		scale() {
			return scale;
		},
		setScale(f) {
			scale = is_number(f) ? {x: f, y: f} : f;
			return this;
		},
		show() {
			visible = true;
			return this;
		},
		hide() {
			visible = false;
			return this;
		},
		render(screen) {
			if (visible) {
				screen.save();
				screen.setScale(scale);
				screen.clipRect(coordinates.rect());
				screen.translate(coordinates.position());
				onRender.call(this, screen, scene, coordinates.localRect());
				screen.restore();
			}
		}
	};
}
