		import { createSceneView } from './modules/scene.js';
		import { createScaleBar } from './modules/scaleBar.js';
		import { loadStarData } from './modules/starData.js';
		import { createStarField } from './modules/starField.js';
		import { setupStarInteraction } from './modules/starInteraction.js';
		import { setupDisplayControls } from './modules/displayControls.js';
		import { createSimulation } from './modules/simulation.js';
		import { setupSimulationControls } from './modules/simulationControls.js';

		const sceneView = createSceneView();
		const { scene, camera, renderer, controls } = sceneView;

		document.querySelectorAll('[data-dialog-target]').forEach((button) => {
			const dialog = document.getElementById(button.dataset.dialogTarget);
			if (!(dialog instanceof HTMLDialogElement)) {
				throw new Error(`Dialog not found: ${button.dataset.dialogTarget}`);
			}

			button.addEventListener('click', () => dialog.showModal());
			dialog.addEventListener('click', (event) => {
				if (event.target === dialog) {
					dialog.close();
				}
			});
		});

		const updateScaleBar = createScaleBar(camera, controls, renderer);

		let simulation = null;
		let simulationControls = null;

		window.addEventListener('resize', () => {
			sceneView.resize();
			updateScaleBar();
		});

		function animate() {
			requestAnimationFrame(animate);

			if (simulation) {
				const elapsedYears = simulation.update();
				if (elapsedYears !== null) {
					simulationControls.updateElapsedTime(elapsedYears);
				}
			}

			sceneView.render();
		}

		async function initializeStarField() {
			try {
				const data = await loadStarData();
				const createdStarField = createStarField(scene, data);
				const starField = createdStarField.starField;
				setupStarInteraction(starField, camera, renderer);
				setupDisplayControls(createdStarField.material);
				simulation = createSimulation(
					starField,
					parseFloat(document.getElementById('simulationSpeed').value)
				);
				simulationControls = setupSimulationControls(simulation);

				const sphere = starField.geometry.boundingSphere;
				camera.position.z = sphere.radius * 2;
				camera.lookAt(sphere.center);
				controls.update();
				updateScaleBar();
				document.getElementById('loading').style.display = 'none';
			} catch (error) {
				console.error('Error initializing star field:', error);
				document.getElementById('loading').innerText = 'Failed to load CSV file.';
			}
		}

		initializeStarField();
		animate();