import times from 'lodash.times';
import vaus from 'game/resources/vaus.svg';
import View from 'ui/view';

export default function LifesView({model}) {
	return View({id: 'lifes', tagName: 'ul', model, onRender(view) {
		const el = view.el();
		times(view.model().lifeCount(), () => {
			const life = document.createElement('li');
			life.innerHTML = vaus;
			life.className = 'life';
			el.appendChild(life);
		});
	}});
}
