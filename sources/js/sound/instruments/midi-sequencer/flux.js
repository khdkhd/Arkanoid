import { Subject } from 'rxjs'

export const Flux = (() => {
	const subject = new Subject()
	return {
		dispatch({type,data}) {
			subject.next({type,data})
		},
		subscribe(action, op) {
			subject
				.filter(({type}) => type === action.type)
				.subscribe((action)=> {
					op(action.data);
				});
		}
	}
})()
