import {expect} from 'chai';
import sinon from 'sinon';

import Coordinates from 'graphics/coordinates';
import SceneObject from 'graphics/scene-object';
import Screen from 'graphics/screen';

import Vector from 'maths/vector';

import CanvasContextMock from 'tests/canvas-context-mock';

const scene_methods = [
	'add',
	'remove',
	'render'
];

function SceneMock() {
	return scene_methods.reduce((mock, method) => Object.assign(
		mock,
		{[method]: sinon.spy()}
	), {screen: Screen(CanvasContextMock())});
}

describe('graphics.SceneObject(coordinates, {[, onSceneChanged][, onRender][, scale][, visible][, zIndex]})', () => {
	const zIndex = 42;
	const position = Vector({x: 1, y: 1});
	const size = {
		width: 1,
		height: 1
	};
	describe('#zIndex()', () => {
		it('returns the z-index', () => {
			const scene_object = SceneObject(Coordinates(size, position), {zIndex});
			expect(scene_object.zIndex()).to.equal(zIndex);
		});
	});
	describe('#setZIndex(z_index)', () => {
		it('sets the z-index', () => {
			const scene_object = SceneObject(Coordinates(size, position), {zIndex});
			scene_object.setZIndex(zIndex + 1);
			expect(scene_object.zIndex()).to.equal(zIndex + 1);
		});
		it('re-adds itself to the scene', () => {
			const scene_object = SceneObject(Coordinates(size, position), {zIndex});
			scene_object.setScene(SceneMock());
			scene_object.setZIndex(zIndex + 1);
			expect(scene_object.scene().add).to.have.been.called;
		});
		it('returns itself', () => {
			const scene_object = SceneObject(Coordinates(size, position));
			expect(scene_object.setZIndex(zIndex)).to.equal(scene_object);
		});
	});
	describe('#scene()', () => {
		it('returns the scene', () => {
			const scene = SceneMock();
			const scene_object = SceneObject(Coordinates(size, position));
			scene_object.setScene(scene);
			expect(scene_object.scene()).to.equal(scene);
		});
	});
	describe('#setScene(scene)', () => {
		it('sets the scene when affected a value', () => {
			const scene = SceneMock();
			const scene_object = SceneObject(Coordinates(size, position));
			scene_object.setScene(scene);
			expect(scene_object.scene()).to.equal(scene);
		});
		it('adds itself to the scene when affected a value', () => {
			const scene_object = SceneObject(Coordinates(size, position));
			const scene = SceneMock();
			scene_object.setScene(scene);
			expect(scene.add).to.have.been.calledOnce;
			expect(scene.add).to.have.been.calledWith(scene_object);
		});
		it('removes itself from the scene when affected null or undefined', () => {
			const scene = SceneMock();
			const scene_object = SceneObject(Coordinates(size, position));
			scene_object.setScene(scene);
			scene_object.setScene(null);
			expect(scene.remove).to.have.been.calledOnce;
			expect(scene.remove).to.have.been.calledWith(scene_object);
		});
		it('calls back onSceneChanged with scene when affected a value', () => {
			const onSceneChanged = sinon.spy();
			const scene_object = SceneObject(Coordinates(size, position), {onSceneChanged});
			const scene = SceneMock();
			scene_object.setScene(scene);
			expect(onSceneChanged).to.have.been.calledOnce;
			expect(onSceneChanged).to.have.been.calledWith(scene);
		});
		it('returns itself', () => {
			const scene_object = SceneObject(Coordinates(size, position));
			expect(scene_object.setScene(null)).to.equal(scene_object);
		});
	});
	describe('#scale()', () => {
		it('returns the scale factor', () => {
			const scene_object = SceneObject(Coordinates(size, position, {scale: 1}));
			expect(scene_object.scale()).to.deep.equal({x: 1, y: 1});
		});
	});
	describe('#setScale(f)', () => {
		it('sets the scale factor', () => {
			const scene_object = SceneObject(Coordinates(size, position, {scale: 1}));
			scene_object.setScale({x: 2, y: 3});
			expect(scene_object.scale()).to.deep.equal({x: 2, y: 3});
		});
		it('returns itself', () => {
			const scene_object = SceneObject(Coordinates(size, position));
			expect(scene_object.setScale(1)).to.equal(scene_object);
		});
	});
	describe('#show()', () => {
		it('makes the object visible', () => {
			const scene_object = SceneObject(Coordinates(size, position));
			scene_object.show();
			expect(scene_object.visible()).to.be.true;
		});
		it('returns itself', () => {
			const scene_object = SceneObject(Coordinates(size, position));
			expect(scene_object.show()).to.equal(scene_object);
		});
	});
	describe('#hide()', () => {
		it('makes the object not visible', () => {
			const scene_object = SceneObject(Coordinates(size, position));
			scene_object.hide();
			expect(scene_object.visible()).to.be.false;
		});
		it('returns itself', () => {
			const scene_object = SceneObject(Coordinates(size, position));
			expect(scene_object.hide()).to.equal(scene_object);
		});
	});
	describe('#setVisible(visibility)', () => {
		it('sets the visibility', () => {
			const scene_object = SceneObject(Coordinates(size, position));
			scene_object.setVisible(true);
			expect(scene_object.visible()).to.be.true;
			scene_object.setVisible(false);
			expect(scene_object.visible()).to.be.false;
		});
		it('returns itself', () => {
			const scene_object = SceneObject(Coordinates(size, position));
			expect(scene_object.hide()).to.equal(scene_object);
		});
	});
	describe('#render()', () => {
		it('calls back onRender if object is visible', () => {
			const onRender = sinon.spy();
			const scene_object = SceneObject(Coordinates(size, position), {onRender});
			const screen = Screen(CanvasContextMock());
			scene_object.show();
			scene_object.render(screen);
			expect(onRender).to.have.been.calledOnce;
		});
		it('does not calls back onRender if object is not visible', () => {
			const onRender = sinon.spy();
			const scene_object = SceneObject(Coordinates(size, position), {onRender});
			const screen = Screen(CanvasContextMock());
			scene_object.hide();
			scene_object.render(screen);
			expect(onRender).to.not.have.been.called;
		});
		it('returns itself', () => {
			const scene_object = SceneObject(Coordinates(size, position));
			const screen = Screen(CanvasContextMock());
			expect(scene_object.render(screen)).to.equal(scene_object);
		});
	});
});
