import View from 'ui/view';

export default function ScoreView({model}) {
	return View({
		id: 'score',
		model,
		modelEvents: {
			changed(attr, value, view) {
				if (attr === 'score') {
					view.render();
				}
			}
		},
		onRender(view) {
			view.el().innerHTML = `${view.model().score()}`;
		}
	});
}
