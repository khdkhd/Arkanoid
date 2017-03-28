export default {
	nodes: [
    {
			id: 'generator',
			factory: 'mono',
			type: 'voice',
			config: {
				type: {
					value: 'sine'
				}
			}
		},
		{
			id: 'enveloppe',
			factory: 'enveloppe',
			config: {
				attack: {
					value: 0
				},
				decay: {
					value: .25
				},
				sustain: {
					value: .5
				},
				release: {
					value: 0
				}
			}
		},
		{
			id: 'filter',
			factory: 'filter',
			type: 'output',
			config: {
				frequency: {
					value: .95,
					views: [{
						factory: 'knob'
					}]
				},
				Q: {
					value: 0,
					views: [{
						factory: 'knob'
					}]
				},
				gain: {
					value: .95
				},
				type: {
					value: 'lowpass'
				}
			},
		},
		{
			id: 'lfo',
			factory: 'lfo',
			config: {
				frequency: {
					value: .125
				},
				amplitude: {
					value: 0.9
				},
				type: {
					value: 'sine'
				}
			}
		},
	],
	connexions: [
		['generator', 'filter'],
		['lfo', 'filter'],
		['enveloppe', 'generator']
	]
};
