import {Model, Collection} from 'model';
import SceneObject from 'graphics/scene-object';
import Vector from 'maths/vector';
import VerletModel from 'physics/verlet-model';

const radius = .3;

export function BallView({verlet}) {
	return SceneObject(verlet, {
		onRender(screen) {
			const scale = screen.absoluteScale().x;
			const center = verlet.localRect().center;
			screen.brush = 'white';
			screen.pen = {
				strokeStyle: 'hsl(210, 50%, 50%)',
				lineWidth: 1/scale
			};
			screen.beginPath();
			screen.arc(center, radius, 0, 2*Math.PI, false);
			screen.closePath();
			screen.fillPath();
			screen.drawPath();
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
		{width: 2*radius, height: 2*radius}, // size
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
		splitter(teta) {
			const cos_teta = Math.cos(teta);
			const sin_teta = Math.sin(teta);
			const m1 = {
				m11:  cos_teta, m12:  sin_teta,
				m21: -sin_teta, m22:  cos_teta
			};
			const m2 = {
				m11:  cos_teta, m12: -sin_teta,
				m21:  sin_teta, m22:  cos_teta
			};
			return () => {
				if (collection.size() === 1) {
					const [ball] = collection;
					const v = ball.velocity();
					collection.create(ball.position(), v.transform(m1));
					collection.create(ball.position(), v.transform(m2));
				}
			};
		}
	});
}

Ball.Radius = radius;

export default Ball;
