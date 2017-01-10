import is_nil from 'lodash.isnil';

export default ({emitter, onRender, zIndex = 0}) => {
	if(is_nil(emitter)){
		throw new TypeError('Scene objects must contain an emitter');
	}

	const state = Object.assign({
		renderEnabled: true
	}, {emitter, onRender, zIndex});

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
