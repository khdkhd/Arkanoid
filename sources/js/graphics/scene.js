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
		add(child, zIndex=0) {
			if(state.children.has(zIndex)){
				state.children.get(zIndex).add(child);
			}
			else {
				state.children.set(zIndex, new Set([child]));
				state.children = new Map([...state.children.entries()].sort((a,b) => a[0] - b[0]));
			}
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

	function render_layer(layer){
		for(let sceneObject of layer.values()){
			sceneObject.render();
		}
	}

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

			for (let layer of state.children.values()) {
				render_layer(layer);
			}

			screen.restore();
		}
	};
}

export default function Scene(screen, rect, scale, backgroundColor = 'rgba(0, 0, 0, 0)') {
	const state = {
		backgroundColor,
		children: new Map([[0, new Set()]]),
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
