export default function createSynth() {
	const AudioContext = window.AudioContext || window.webkitAudioContext;
	const audioContext = new AudioContext();
	const oscillator = audioContext.createOscillator();
	const gainNode = audioContext.createGain();

	return {
		wire() {
			gainNode.connect(audioContext.destination);
		    oscillator.connect(audioContext.destination);
		},
		play() {
			oscillator.type = 'square';
			gainNode.gain.value = .001;
			oscillator.frequency.value = 440;
			oscillator.start(0);
		},
		stop() {
			oscillator.stop();
		}
	};
}
