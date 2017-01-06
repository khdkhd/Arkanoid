import is_nil from 'lodash.isnil';


export default ({emitter, onRender}) => {

	if(is_nil(emitter)){
		throw new TypeError('Scene objects must contain an emitter');
	}

	const state = Object.assign({
		zIndex: 0,
		renderEnabled: true,
		scene: null
	}, {emitter, onRender});

	return {
		set zIndex(value){
			state.zIndex = value;
			state.emitter.emit('zindex-changed', state.zIndex);
		},
		get zIndex(){
			return state.zIndex;
		},

		toggleRender(enabled){
			if(is_nil(enabled)){
				state.renderEnabled = !state.renderEnabled;
			} else {
				state.renderEnabled = enabled;
			}
		},
		render(screen){
			if(state.renderEnabled){
				screen.save();
				onRender(screen);
				screen.restore();
			}
		}
	};
}
