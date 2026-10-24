import * as THREE from 'three';

const KM_S_TO_PC_YEAR = 1.022712e-6;

export function createSimulation(starField, initialYearsPerSecond) {
	const clock = new THREE.Clock();
	let running = false;
	let simulationYears = 0;
	let yearsPerSecond = initialYearsPerSecond;

	function update() {
		const deltaSeconds = clock.getDelta();
		if (!running) return null;

		const positions = starField.geometry.attributes.position.array;
		const velocities = starField.geometry.attributes.velocity.array;
		const elapsedYears = deltaSeconds * yearsPerSecond;

		simulationYears += elapsedYears;

		for (let i = 0; i < positions.length; i += 3) {
			positions[i] += velocities[i] * elapsedYears * KM_S_TO_PC_YEAR;
			positions[i + 1] += velocities[i + 1] * elapsedYears * KM_S_TO_PC_YEAR;
			positions[i + 2] += velocities[i + 2] * elapsedYears * KM_S_TO_PC_YEAR;
		}

		starField.geometry.attributes.position.needsUpdate = true;
		return simulationYears;
	}

	function toggle() {
		running = !running;
		if (running) {
			clock.getDelta();
		}
		return running;
	}

	function reset() {
		running = false;
		simulationYears = 0;

		const positions = starField.geometry.attributes.position.array;
		positions.set(starField.userData.initialPositions);
		starField.geometry.attributes.position.needsUpdate = true;
	}

	function setYearsPerSecond(value) {
		yearsPerSecond = value;
	}

	return {
		update,
		toggle,
		reset,
		setYearsPerSecond,
		get running() {
			return running;
		},
		get simulationYears() {
			return simulationYears;
		}
	};
}
