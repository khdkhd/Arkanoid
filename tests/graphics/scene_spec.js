import {expect} from 'chai';
import sinon from 'sinon';

import Coordinates from 'graphics/coordinates';
import {SceneController, default as Scene} from 'graphics/scene';
import SceneObject from 'graphics/scene-object';
import Screen from 'graphics/screen';

import Vector from 'maths/vector';

import CanvasContextMock from 'tests/canvas-context-mock';

describe('graphics.Scene(coordinates, {[backgroundColor][, scale][, visible][, zIndex]})', () => {
	const position = Vector({x: 1, y: 1});
	const size = {
		width: 1,
		height: 1
	};
	describe('#position()', () => {
		it('returns the position of the scene', () => {
			const scene = Scene(Coordinates(size, position));
			const pos = scene.position();
			expect(pos.x).to.equal(position.x);
			expect(pos.y).to.equal(position.y);
		});
	});
	describe('#localRect()', () => {
		it('returns the local bounding rect of the scene', () => {
			const scene = Scene(Coordinates(size, position));
			const rect = scene.localRect();
			expect(rect.topLeft.x).to.equal(0);
			expect(rect.topLeft.y).to.equal(0);
			expect(rect.size).to.deep.equal(size);
		});
	});
	describe('#rect()', () => {
		it('returns the bounding rect of the scene', () => {
			const scene = Scene(Coordinates(size, position));
			const rect = scene.rect();
			expect(rect.topLeft.x).to.equal(position.x);
			expect(rect.topLeft.y).to.equal(position.y);
			expect(rect.size).to.deep.equal(size);
		});
	});
	describe('#size()', () => {
		it('returns the size of the scene', () => {
			const scene = Scene(Coordinates(size, position));
			expect(scene.size()).to.deep.equal(size);
		});
	});
	describe('#add(...objects)', () => {
		it('adds the givens objects to the scene', () => {
			const children = [];
			const scene = SceneController({children});
			const obj1 = SceneObject(Coordinates(size, position));
			const obj2 = SceneObject(Coordinates(size, position));
			scene.add(obj1, obj2);
			expect(children).to.have.lengthOf(2);
			expect(children).to.include(obj1);
			expect(children).to.include(obj2);
			expect(obj1.scene()).to.equal(scene);
			expect(obj2.scene()).to.equal(scene);
		});
		it('returns itself', () => {
			const scene = SceneController({children: []});
			expect(scene.add(SceneObject(Coordinates(size, position)))).to.equal(scene);
		});
	});
	describe('#remove(object)', () => {
		it('removes the object from the scene', () => {
			const children = [];
			const scene = SceneController({children});
			const obj = SceneObject(Coordinates(size, position));
			scene.add(obj);
			scene.remove(obj);
			expect(children).to.be.empty;
			expect(obj.scene()).to.be.null;
		});
		it('returns itself', () => {
			const children = [];
			const scene = SceneController({children});
			expect(scene.add(SceneObject(Coordinates(size, position)))).to.equal(scene);
		});
	});
	describe('#render(screen)', () => {
		const onRender = sinon.spy();
		const screen = Screen(CanvasContextMock());
		const scene = Scene(Coordinates(size, position));
		const obj = SceneObject(Coordinates(size, position), {
			onRender
		});
		scene.add(obj);
		scene.render(screen);
		expect(onRender).to.have.been.calledOnce;
		expect(onRender).to.have.been.calledWith(screen);
	});
});
