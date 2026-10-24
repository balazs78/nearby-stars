import * as THREE from 'three';

function kelvinToRGB(kelvin) {
	const stops = [
		{ temp: 2500, color: new THREE.Color(0xff2200) },
		{ temp: 3500, color: new THREE.Color(0xff6600) },
		{ temp: 5000, color: new THREE.Color(0xffee33) },
		{ temp: 6500, color: new THREE.Color(0xffffff) },
		{ temp: 9000, color: new THREE.Color(0x66aaff) },
		{ temp: 15000, color: new THREE.Color(0x2277ff) },
		{ temp: 40000, color: new THREE.Color(0x4422ff) }
	];

	kelvin = THREE.MathUtils.clamp(kelvin, 2500, 40000);

	for (let i = 0; i < stops.length - 1; i++) {
		const a = stops[i];
		const b = stops[i + 1];

		if (kelvin >= a.temp && kelvin <= b.temp) {
			const t = (kelvin - a.temp) / (b.temp - a.temp);
			return a.color.clone().lerp(b.color, t);
		}
	}

	return stops[stops.length - 1].color.clone();
}

function transformVelocityToCartesian(raRad, decRad, raVelocity, decVelocity, radialVelocity) {
	const cosRa = Math.cos(raRad);
	const sinRa = Math.sin(raRad);
	const cosDec = Math.cos(decRad);
	const sinDec = Math.sin(decRad);
	const eastVelocity = Number.isFinite(raVelocity) ? raVelocity : 0;
	const northVelocity = Number.isFinite(decVelocity) ? decVelocity : 0;
	const outwardVelocity = Number.isFinite(radialVelocity) ? radialVelocity : 0;

	return [
		outwardVelocity * cosDec * cosRa
			- eastVelocity * sinRa
			- northVelocity * sinDec * cosRa,
		outwardVelocity * cosDec * sinRa
			+ eastVelocity * cosRa
			- northVelocity * sinDec * sinRa,
		outwardVelocity * sinDec + northVelocity * cosDec
	];
}

export async function loadStarData(
	url = new URL('../stars.csv', import.meta.url).href
) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to load star data: ${response.status} ${response.statusText}`);
	}

	const csvText = await response.text();
	const lines = csvText.split('\n');
	const positions = [];
	const colors = [];
	const absoluteMagnitudes = [];
	const starMetadata = [];
	const velocities = [];

	for (let i = 1; i < lines.length; i++) {
		const row = lines[i].split(',');
		if (row.length < 2) continue;

		const starName = row[1];
		const raDeg = parseFloat(row[2]);
		const decDeg = parseFloat(row[3]);
		const distance = parseFloat(row[14]);
		const tempKelvin = row[9] ? parseFloat(row[9]) : 5778;
		const spectralType = row[8];
		const luminosity = parseFloat(row[16]);

		if (isNaN(raDeg) || isNaN(decDeg)) continue;

		const raRad = raDeg * (Math.PI / 180);
		const decRad = decDeg * (Math.PI / 180);
		positions.push(
			distance * Math.cos(decRad) * Math.cos(raRad),
			distance * Math.cos(decRad) * Math.sin(raRad),
			distance * Math.sin(decRad)
		);

		absoluteMagnitudes.push(parseFloat(row[15]));
		starMetadata.push({
			name: starName,
			ra: raDeg,
			dec: decDeg,
			distance,
			temperature: tempKelvin,
			luminosity,
			spectralType
		});

		const raVelocity = parseFloat(row[20]);
		const decVelocity = parseFloat(row[21]);
		const radialVelocity = parseFloat(row[6]);
		velocities.push(
			...transformVelocityToCartesian(
				raRad,
				decRad,
				raVelocity,
				decVelocity,
				radialVelocity
			)
		);

		const starColor = kelvinToRGB(isNaN(tempKelvin) ? 5778 : tempKelvin);
		const brightness = Math.max(
			0.4,
			Math.min(3.0, Math.log10(luminosity + 1))
		);
		starColor.multiplyScalar(brightness);
		colors.push(starColor.r, starColor.g, starColor.b);
	}

	return { positions, colors, absoluteMagnitudes, starMetadata, velocities };
}
