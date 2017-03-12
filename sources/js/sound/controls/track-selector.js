import Vector from 'maths/vector';
import Rect from 'maths/rect';
import EventEmitter from 'events';
import { completeAssign as assign } from 'common/utils';
import ui from 'sound/controls/ui';

import is_nil from 'lodash.isnil';
import Coordinates from 'graphics/coordinates';
import SceneObject from 'graphics/scene-object';


function view(state){
	const pos = Vector({x: 0, y: 0});

	const rect = Rect(
		pos,
		{
			width: state.screen.width,
			height: state.screen.height
		}
	);
	const coordinates = Coordinates(rect);

	const background = SceneObject(coordinates, {
		onRender(screen) {
			screen.save();
			screen.pen = 1;
			screen.brush = '#bdbdbd';
			screen.pen = '#fff';
			screen.fillRect(rect);
			screen.drawRect(rect);
			screen.restore();
		},
		zIndex: 0
	});

	state.screen.add(background);

	return {
		render(){
			state.screen.render()
		}
	}
}

function controller(state){


	return {
		set param(sequencer){
			console.log(sequencer);
			state.sequencer = sequencer
			ui.bind_events({
				element: state.element,
				mousedown(){
					console.log('mousedown');
					if(!is_nil(state.sequencer)){
						state.sequencer.track.value = state.track_id
					}
				}
			});
		},
		set trackId(id){
			state.track_id = id;
		}
	}
}

export default ({element, screen})=> {
	const state = {
		element,
		screen,
		emitter: new EventEmitter()
	}
	return assign(state.emitter, view(state), controller(state))
}
