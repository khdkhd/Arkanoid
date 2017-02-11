import is_nil from 'lodash.isnil';

export default ({el, model}) => {
	const render = () => {
		el.innerHTML = '';
		if (!is_nil(model)) {
			el.innerHTML = `${model.points()}`;
		}
	};
	return {
		model() {
			return model;
		},
		setModel(new_model) {
			if (!is_nil(model)) {
				model.removeListener('changed', render);
			}
			model = new_model;
			if (!is_nil(model)) {
				model.on('changed', render);
			}
			render();
			return this;
		},
		render
	};
}
