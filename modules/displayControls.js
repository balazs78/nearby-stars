export function setupDisplayControls(material) {
	const magnitudeSlider = document.getElementById('magnitudeSlider');
	const magnitudeValue = document.getElementById('magnitudeValue');
	const sizeSlider = document.getElementById('sizeSlider');
	const sizeValue = document.getElementById('sizeValue');

	function updateStarSize() {
		const size = parseFloat(sizeSlider.value);
		material.uniforms.starSize.value = size;
		sizeValue.textContent = size.toFixed(1);
	}

	function updateMagnitudeLimit() {
		const magnitude = parseFloat(magnitudeSlider.value);
		material.uniforms.maxMagnitude.value = magnitude;
		magnitudeValue.textContent = magnitude.toFixed(1);
	}

	sizeSlider.addEventListener('input', updateStarSize);
	magnitudeSlider.addEventListener('input', updateMagnitudeLimit);
	updateStarSize();
	updateMagnitudeLimit();
}
