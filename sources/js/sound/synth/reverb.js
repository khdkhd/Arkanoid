import Rx from 'rxjs';

export const Reverb = ({ audio_context }) => {

	const convolver = audio_context.createConvolver();
	const merger = audio_context.createChannelMerger(2);
	const splitter = audio_context.createChannelSplitter(2);
	const wetGain = audio_context.createGain();
	const dryGain = audio_context.createGain();
	splitter.connect(wetGain);
	splitter.connect(dryGain);
	wetGain.connect(convolver);
	convolver.connect(merger);
	dryGain.connect(merger);
	wetGain.gain.value = 0.075;
	return {
		connect({ input, connect }) {
			merger.connect(input);
			return { connect };
		},
		setImpulse(url) {
			return Rx.Observable.create(observer => {
				const xhr = new XMLHttpRequest()
				xhr.open('GET', url, true)
				xhr.responseType = 'arraybuffer'
				xhr.onload = () => {
					audio_context.decodeAudioData(xhr.response, (buffer) => {
						convolver.buffer = buffer;
						convolver.loop = true;
						convolver.normalize = true;
						observer.next(convolver);
						observer.complete();
					});
				}
				xhr.onError = (event) => {
					observer.error(event)
				}
				xhr.send()
			})
		},
		input: splitter
	}
}
