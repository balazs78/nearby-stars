const parsecsPerLightYear = 1 / 3.26156;

export function createScaleBar(camera, controls, renderer) {
	const lightYearScaleLabel = document.getElementById('lightYearScaleLabel');
	const parsecScaleLabel = document.getElementById('parsecScaleLabel');
	const scaleBarLine = document.querySelector('.scaleBarLine');

	function updateScaleBar() {
		const distanceToTarget = camera.position.distanceTo(controls.target);
		const visibleWorldWidth =
			2 * distanceToTarget * Math.tan(camera.fov * Math.PI / 360) *
			camera.aspect / camera.zoom;
		const targetWidth = scaleBarLine.clientWidth;
		const maximumScalePc = targetWidth * visibleWorldWidth / renderer.domElement.clientWidth;
		const scaleMagnitude = Math.pow(10, Math.floor(Math.log10(maximumScalePc)));
		const normalizedScale = maximumScalePc / scaleMagnitude;
		const scalePc = [5, 2, 1].find(value => value <= normalizedScale) * scaleMagnitude;
		const formatValue = value => new Intl.NumberFormat(undefined, {
			maximumSignificantDigits: 3
		}).format(value);

		lightYearScaleLabel.textContent =
			`${formatValue(scalePc / parsecsPerLightYear)} lightyears`;
		parsecScaleLabel.textContent = `${formatValue(scalePc)} pc`;
	}

	controls.addEventListener('change', updateScaleBar);

	return updateScaleBar;
}
