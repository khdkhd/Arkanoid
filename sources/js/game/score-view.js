import View from 'ui/view';

export default function ScoreView({model}) {
	return View({id: 'score', model, onRender(view) {
		view.el().innerHTML = `${view.model().score()}`;
	}});
}
