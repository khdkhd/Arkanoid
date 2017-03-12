import View from 'ui/view';

export default ({el, model}) => {
	return View({el, model, onRender(view) {
		view.el().innerHTML = `${view.model().points()}`;
	}});
}
