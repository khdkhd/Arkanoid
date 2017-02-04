import is_nil from 'lodash.isnil';
import times from 'lodash.times';

export default ({el, model}) => {
	const render = () => {
		el.innerHTML = '';
		if (!is_nil(model)) {
			times(model.lifes(), () => {
				const life = document.createElement('span');
				life.className = 'life';
				el.appendChild(life);
			});
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
