import ui from 'ui';
import Knob from 'sound/knob';

const screen = ui.screen;

const knob1 = Knob({x:50,y:50});
const knob2 = Knob({x:150,y:50});


export default function createView(){

	return {
		render(){
			screen.brush = '#123';
			screen.clear();
			knob1.render(screen);
			knob2.render(screen);
		},
		subscribe(synth){
			knob1.param = synth.synth_parts[1].frequency;
			knob2.param = synth.synth_parts[2].frequency;

		}
	};
}
