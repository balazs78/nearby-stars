const starFragmentShader = `varying vec3 vColor;

	void main() {
		float d = distance(gl_PointCoord, vec2(0.5));

		if (d > 0.5) {
			discard;
		}

		// Bright core + soft outer edge
		float core = 1.0 - smoothstep(0.0, 0.22, d);
		float glow = 1.0 - smoothstep(0.15, 0.5, d);

		float alpha = max(core, glow * 0.55);

		gl_FragColor = vec4(vColor, alpha);
	}`;

export default starFragmentShader;
