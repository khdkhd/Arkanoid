import kebab_case from 'lodash.kebabcase';
import is_nil from 'lodash.isnil';

const to_attribute_name  = name => `data-${kebab_case(name)}`;

export default function(window) {
	if (is_nil(window.Element.prototype.dataset)) {
		Object.defineProperty(window.Element.prototype, 'dataset', {
			get() {
				return new Proxy(this, {
					get(target, name) {
						return target.getAttribute(to_attribute_name(name));
					},
					set(target, name, value) {
						target.setAttribute(to_attribute_name(name), value);
						return true;
					},
					defineProperty(target, name) {
						target.removeAttribute(name);
					}
				});
			}
		});
	}
}
