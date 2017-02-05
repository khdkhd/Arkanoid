export default  {
	nodes: [
		{
			id: 'generator',
			factory: 'mono',
			type: 'voice',
			config: {
				type: {
					value: 'square'
				}
			}
		},
		{
			id: 'filter',
			factory: 'filter',
			type: 'output',
			config: {
				frequency: {
					value: 1
				},
				Q: {
					value: 0
				},
				type : {
					value: 'lowpass'
				}
			},
		}
	],
	connexions: [
		['generator', 'filter']
	]

};
