import {Model, Collection} from 'model';
import SceneObject from 'graphics/scene-object';
import Vector from 'maths/vector';
import VerletModel from 'physics/verlet-model';

import is_nil from 'lodash.isnil';
import times from 'lodash.times';

const radius = .2;

const white = '#ffffff';
const blue  = '#00ffff';

const paths  = [
	[new Path2D(`M${ 2/16} ${ 0/16}L${ 8/16} ${ 0/16}L${ 8/16} ${ 8/16}L${ 2/16} ${ 8/16}L${ 2/16} ${ 0/16}Z`), white],
	[new Path2D(`M${ 0/16} ${ 2/16}L${10/16} ${ 2/16}L${10/16} ${ 6/16}L${ 0/16} ${ 6/16}L${ 0/16} ${ 2/16}Z`), white],
	[new Path2D(`M${ 2/16} ${ 2/16}L${ 8/16} ${ 2/16}L${ 8/16} ${ 6/16}L${ 2/16} ${ 6/16}L${ 2/16} ${ 2/16}Z`),  blue],
];

export function BallView({verlet}) {
	return SceneObject(verlet, {
		onRender(screen) {
			screen.drawRect(this.localRect());
			for (let [path, color] of paths) {
				screen.brush = color;
				screen.fillPath(path);
			}
		}
	});
}

export function BallController({verlet}) {
	return Object.assign({
		reset({x, y}) {
			verlet.setVelocity(Vector.Null);
			verlet.setPosition(Vector({x, y}));
			return this;
		}
	}, verlet);
}

export function Ball(
	{x: px, y: py} = Vector.Null,
	{x: vx, y: vy} = Vector.Null
) {
	const verlet = VerletModel(
		{width: .625, height: .5}, // size
		{x: px, y: py}, // initial position
		{x: vx, y: vy}  // initial speed
	);
	return Object.assign(
		Model(),
		verlet,
		BallView({verlet}),
		BallController({verlet})
	);
}

export function BallCollection() {
	const collection = Collection({ItemModel: Ball});
	const cos_teta = Math.cos(Math.PI/8);
	const sin_teta = Math.sin(Math.PI/8);
	const transforms = [{
		m11:  cos_teta, m12:  sin_teta,
		m21: -sin_teta, m22:  cos_teta
	}, {
		m11:  cos_teta, m12: -sin_teta,
		m21:  sin_teta, m22:  cos_teta
	}];
	collection
		.on('itemDestroyed', () => {
			if (collection.size() === 0) {
				collection.emit('empty');
			}
		})
		.on('itemAdded', ball => {
			ball.on('hit', type => collection.emit('hit', type, ball));
		});
	return Object.assign(collection, {
		hide() {
			collection.forEach(ball => ball.hide());
			return this;
		},
		show() {
			collection.forEach(ball => ball.show());
			return this;
		},
		update() {
			collection.forEach(ball => ball.update());
			return this;
		},
		setSpeed(speed) {
			collection.forEach(ball => {
				const velocity = ball.velocity();
				ball.setVelocity(velocity.mul(speed/velocity.norm));
			});
			return this;
		},
		split() {
			const [ball] = collection;
			const v = ball.velocity();
			times(3 - collection.size(), n => {
				collection.create(ball.position(), v.transform(transforms[n]));
			});
			return this;
		},
		unsplit() {
			const [,b1, b2] = collection;
			if (!is_nil(b1)) {
				b1.destroy();
			}
			if (!is_nil(b2)) {
				b2.destroy();
			}
			return this;
		}
	});
}

Ball.Radius = radius;

export default Ball;
