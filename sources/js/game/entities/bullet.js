import {Model, Collection} from 'model';
import SceneObject from 'graphics/scene-object';
import Vector from 'maths/vector';
import VerletModel from 'physics/verlet-model';

const box1 = new Path2D(`
	M${2/16} 0
	L${4/16} 0
	L${4/16} 1
	L${2/16} 1
	L${2/16} 0
	Z
`);
const box2 = new Path2D(`
	M0 ${2/16}
	L${6/16} ${2/16}
	L${6/16} ${14/16}
	L0 ${14/16}
	L0 ${2/16}
	Z
`);

export function BulletView({verlet}) {
	return SceneObject(verlet, {
		onRender(screen) {
			screen.brush = '#ffff00';
			screen.fillPath(box1);
			screen.fillPath(box2);
		}
	});
}

export default function Bullet({x, y} = Vector.Null) {
	const verlet = VerletModel(
		{width: 6/16, height: 1},
		{x, y},
		{x: 0, y: -.2}
	);
	return Object.assign(
		Model(),
		verlet,
		BulletView({verlet})
	);
}

export function BulletCollection() {
	return Collection({ItemModel: Bullet});
}
