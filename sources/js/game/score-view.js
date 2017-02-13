import View from 'ui/view';

export default ({el, model}) => {
	return View({el, model, onRender(el, model) {
		el.innerHTML = `${model.points()}`;
	}});
}
