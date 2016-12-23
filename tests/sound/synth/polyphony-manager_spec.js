import { expect } from 'chai';
import create_polyphony_manager from 'sound/synth/polyphony-manager';

describe('create_polyphonic_generator', () => {

	it('should return an object', () => {
		const polyphony_manager = create_polyphony_manager({num_voices:undefined});
		expect(polyphony_manager).to.be.an('object');
	});

	it('should return an object', () => {
		const polyphony_manager = create_polyphony_manager({num_voices:1});
		expect(polyphony_manager).to.be.an('object');
	});

	it('should allow one voice', () => {
		const polyphony_manager = create_polyphony_manager({num_voices:1});
		const first_assignment = polyphony_manager.assign(440.);
		expect(first_assignment).to.be.equal(0);
		const second_assignment  = polyphony_manager.assign(880.);
		expect(second_assignment).to.be.equal(0);
		expect(polyphony_manager.unassign(440.)).to.be.equal(-1);
		expect(polyphony_manager.unassign(880.)).to.be.equal(0);
	});

});
