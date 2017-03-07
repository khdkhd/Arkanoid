import times from 'lodash.times';
import vaus from 'game/resources/vaus.svg';
import View from 'ui/view';

export default ({el, model}) => {
	return View({el, model, onRender(view) {
		const el = view.el();
		times(view.model().count(), () => {
			const life = document.createElement('li');
			life.innerHTML = vaus;
			life.className = 'life';
			el.appendChild(life);
		});
	}});
}
