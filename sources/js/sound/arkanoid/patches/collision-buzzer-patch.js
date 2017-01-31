export default  {
	nodes: [
		{
			id: 'generator',
			factory: 'buzz_generator',
			voice: true,
			config: {
				gain: {
					value: 1
				},
				type: {
					value: 'square'
				}
			}
		},
		{
			id: 'filter',
			factory: 'biquad_filter',
			output: true,
			config: {
				frequency: {
					value: 1,
					views: [
						{
							factory: 'knob',
							options: {
								pos: {
									x: 100,
									y: 100
								},
								radius: 20
							}
						}
					]
				},
				Q: {
					value: 0,
					views: [
						{
							factory: 'knob',
							options: {
								pos: {
									x: 150,
									y: 100
								},
								radius: 20
							}
						}
					]
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
					value: 0.025,
					views: [
						{
							factory: 'knob',
							options: {
								pos: {
									x: 200,
									y: 100
								},
								radius: 20
							}
						}
					]
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
		['generator', 'filter'],
		['lfo', 'filter']
	]

};
