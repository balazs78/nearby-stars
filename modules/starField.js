import * as THREE from 'three';
import starVertexShader from './shaders/starVertexShader.js';
import starFragmentShader from './shaders/starFragmentShader.js';

export function createStarField(scene, data) {
	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.Float32BufferAttribute(data.positions, 3));
	geometry.setAttribute('color', new THREE.Float32BufferAttribute(data.colors, 3));
	geometry.setAttribute(
		'magnitude',
		new THREE.Float32BufferAttribute(data.absoluteMagnitudes, 1)
	);
	geometry.setAttribute(
		'velocity',
		new THREE.Float32BufferAttribute(data.velocities, 3)
	);
	geometry.computeBoundingBox();

	const initialPositions = new Float32Array(data.positions);
	const center = new THREE.Vector3();
	geometry.boundingBox.getCenter(center);
	geometry.translate(-center.x, -center.y, -center.z);

	const material = new THREE.ShaderMaterial({
		vertexShader: starVertexShader,
		fragmentShader: starFragmentShader,
		uniforms: {
			maxMagnitude: { value: 10.0 },
			starSize: { value: 2 }
		},
		transparent: true,
		depthWrite: false,
		blending: THREE.NormalBlending
	});

	const starField = new THREE.Points(geometry, material);
	starField.userData.starMetadata = data.starMetadata;
	starField.userData.initialPositions = initialPositions;
	scene.add(starField);
	geometry.computeBoundingSphere();

	return { starField, material };
}
