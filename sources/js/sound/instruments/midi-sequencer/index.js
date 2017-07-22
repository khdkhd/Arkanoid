import { Core } from './core'
import Grid from './grid'

export default ({ audio_context }) => {
	const core = Core({ audio_context });

	document.addEventListener('keyup', event => {
		switch (event.key) {
			case ' ':
				return core.isStarted() ? core.stop() : core.start()
		}
	})

	return core
}
