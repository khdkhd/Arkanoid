import is_nil from 'lodash.isnil';

export default ({el = null, model = null, onRender} = {}) => {
	const state = {
		el,
		model
	};
	const render = () => {
		if (!is_nil(state.el)) {
			state.el.innerHTML = '';
			if (!is_nil(state.model)) {
				onRender(el, state.model);
			}
		}
	};
	return {
		attach(el) {
			state.el = el;
			return this;
		},
		model() {
			return state.model;
		},
		setModel(model) {
			// disconnect from previous model
			if (!is_nil(state.model)) {
				state.model.removeListener('changed', render);
			}
			// connect to new model
			if (!is_nil(model)) {
				model.on('changed', render);
			}
			state.model = model;
			render();
			return this;
		},
		render() {
			render();
			return this;
		}
	};
}
