import { createElement } from 'ui/view';
import is_nil from 'lodash.isnil';

export default function GroupView({
  classNames = [],
  attributes = {},
  el = null,
  id,
  tagName = 'div'}) {
  const state = {
    views: [],
    el
  }
  let[width, height] = [0,0];
  return {
    add(view){
      state.views.push(view);
      return this;
    },
    el(){
      return state.el;
    },
    render() {
			state.el = createElement({el: state.el, attributes, classNames, id, tagName});
			state.views.forEach(view => {
        view.disconnect()
        state.el.appendChild(view.render().el())
        view.connect()
      });
			return this;
		},
    disconnect(){

    },
    connect(){

    },
    screen() {
      return {
        render(){
          state.views.forEach(view=> view.screen().render())
        }
      }
    }
  }
}
