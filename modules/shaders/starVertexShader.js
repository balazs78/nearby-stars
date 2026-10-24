const starVertexShader = `attribute float magnitude;
	attribute vec3 color;

	uniform float maxMagnitude;
	uniform float starSize;

	varying vec3 vColor;

	void main() {
		vColor = color;

		if (magnitude > maxMagnitude) {
			gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
			gl_PointSize = 0.0;
			return;
		}

		vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

		// User-controlled disk size, with perspective scaling
		gl_PointSize = starSize * (300.0 / -mvPosition.z);

		gl_Position = projectionMatrix * mvPosition;
	}`;

export default starVertexShader;
