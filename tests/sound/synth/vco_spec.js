import { expect } from 'chai';
import create_vco from 'sound/synth/vco';
import create_audio_context from '../test-assets/audio-context_mock';
import sinon from 'sinon';

const context = {
	sandbox: sinon.sandbox.create()
};

describe('create_vco', () => {

	beforeEach(function() {
		context.audio_context = create_audio_context(context.sandbox);
	});

	afterEach(() => {
		context.sandbox.restore();
	});


	it('returns an object', () => {
		const vca = create_vco(context.audio_context);
		expect(vca).to.be.an('object');
	});

	it('returns an object with a type property', () => {
		const vco = create_vco(context.audio_context);
		expect(vco).to.have.property('type');
	});


});
