import * as THREE from 'three';

export function setupStarInteraction(starField, camera, renderer) {
	function showStarInfo(star) {
		document.getElementById('starName').textContent =
			star.name || 'Unnamed star';

		document.getElementById('starDetails').innerHTML = `
			<p><strong>Name:</strong> ${star.name}</p>
			<p><strong>RA:</strong> ${star.ra.toFixed(4)}°</p>
			<p><strong>Dec:</strong> ${star.dec.toFixed(4)}°</p>
			<p><strong>Distance:</strong> ${star.distance.toFixed(2)} pc</p>
			<p><strong>Temperature:</strong> ${star.temperature.toFixed(0)} K</p>
			<p><strong>Spectral type:</strong> ${star.spectralType}</p>
			<p><strong>Luminosity:</strong> ${star.luminosity.toFixed(3)} L☉</p>
		`;

		document.getElementById('starInfo').classList.remove('hidden');
	}

	function pickStar(event) {
		if (!event.ctrlKey) return;

		const rect = renderer.domElement.getBoundingClientRect();
		const clickX = event.clientX - rect.left;
		const clickY = event.clientY - rect.top;
		let bestStar = null;
		let bestDistance = Infinity;

		const positionAttribute = starField.geometry.attributes.position;
		const magnitudeAttribute = starField.geometry.attributes.magnitude;
		const projected = new THREE.Vector3();

		for (let i = 0; i < positionAttribute.count; i++) {
			const metadata = starField.userData.starMetadata[i];

			if (
				magnitudeAttribute.getX(i) >
				starField.material.uniforms.maxMagnitude.value
			) {
				continue;
			}

			projected.fromBufferAttribute(positionAttribute, i);
			projected.project(camera);

			if (projected.z < -1 || projected.z > 1) continue;

			const screenX = (projected.x * 0.5 + 0.5) * rect.width;
			const screenY = (-projected.y * 0.5 + 0.5) * rect.height;
			const dx = clickX - screenX;
			const dy = clickY - screenY;
			const distance = Math.sqrt(dx * dx + dy * dy);
			const selectionRadius = 12;

			if (distance <= selectionRadius && distance < bestDistance) {
				bestDistance = distance;
				bestStar = metadata;
			}
		}

		if (bestStar) {
			showStarInfo(bestStar);
		}
	}

	renderer.domElement.addEventListener('click', pickStar);
	document.getElementById('closeInfo').addEventListener('click', () => {
		document.getElementById('starInfo').classList.add('hidden');
	});
}
