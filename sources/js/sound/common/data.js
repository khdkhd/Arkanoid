export default element => {
  return []
    .filter
    .call(element.attributes, attr => /^data-/.test(attr.name))
		.reduce((a, i) => {
			a[i.name] = i.value
			return a
		}, {})
}
