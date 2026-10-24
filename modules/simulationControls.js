export function setupSimulationControls(simulation) {
	const simulationButton = document.getElementById('simulationButton');
	const resetButton = document.getElementById('resetButton');
	const speedSlider = document.getElementById('simulationSpeed');
	const speedValue = document.getElementById('speedValue');
	const elapsedTime = document.getElementById('elapsedTime');

	function formatElapsedYears(years) {
		if (years > 1_000_000) {
			return `${(years / 1_000_000).toFixed(2)} million years`;
		}
		if (years > 20_000) {
			return `${(years / 1_000).toFixed(1)} thousand years`;
		}
		return `${years.toFixed(0)} years`;
	}

	function updateSimulationButton() {
		const action = simulation.running ? 'Pause' : 'Start';
		simulationButton.dataset.running = String(simulation.running);
		simulationButton.title = `${action} simulation`;
		simulationButton.setAttribute('aria-label', `${action} simulation`);
	}

	function updateElapsedTime(years) {
		elapsedTime.textContent = formatElapsedYears(years);
	}

	function updateSpeed() {
		const yearsPerSecond = parseFloat(speedSlider.value);
		simulation.setYearsPerSecond(yearsPerSecond);
		speedValue.textContent = yearsPerSecond;
	}

	simulationButton.addEventListener('click', () => {
		simulation.toggle();
		updateSimulationButton();
	});

	resetButton.addEventListener('click', () => {
		simulation.reset();
		updateElapsedTime(simulation.simulationYears);
		updateSimulationButton();
	});

	speedSlider.addEventListener('input', updateSpeed);
	updateSpeed();
	updateElapsedTime(simulation.simulationYears);
	updateSimulationButton();

	return { updateElapsedTime };
}
