import { createSynth as Synth, createSequencer as Seq } from 'sound-engine';
import {expect} from 'chai';
import sinon from 'sinon';


const audio_context_methods = [
	'createOscillator' // TODO: complete
];

function createAudioContextMock() {
	return audio_context_methods.reduce((mock, method) => Object.assign(
		mock,
		{[method]: sinon.spy()}
	), {
		currentTime: 0
	});
}

describe('createSynth(audio_context)',()=>{
	it('creates and return a new Synth object', () => {
		const synth = Synth(createAudioContextMock());
		expect(synth).to.be.an('object');
	});
});

describe('createSequencer(audio_context)',()=>{
	it('creates and return a new Sequencer object', () => {
		const seq = Seq(createAudioContextMock());
		expect(seq).to.be.an('object');
	});
});
