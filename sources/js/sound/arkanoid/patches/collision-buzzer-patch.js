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
		},
		{
			id: 'lfo',
			factory: 'lfo',
			config: {
				frequency: {
					value: 0.025
				},
				amplitude: {
					value: 1
				},
				type: {
					value: 'square'
				}
			}
		}
	],
	connexions: [
		['generator', 'filter']
	]

};
