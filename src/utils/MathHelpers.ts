/**
 * Math and geometry utility functions
 */

/**
 * Get a vector perpendicular to the given vector
 */
export function getPerpendicularVector(v: Vector3): Vector3 {
	let perp = new Vector3(-v.Y, v.X, 0);
	if (perp.Magnitude === 0) {
		perp = new Vector3(0, -v.Z, v.Y);
	}
	return perp.Unit;
}

/**
 * Format a value for text display
 */
export function formatValue(value: unknown, precision: number = 3): string {
	if (typeIs(value, "string")) {
		return value;
	} else if (typeIs(value, "number")) {
		return string.format(`%.${precision}f`, value);
	} else if (typeIs(value, "Vector3")) {
		const format = `%.${precision}f`;
		return `(${string.format(format, value.X)}, ${string.format(format, value.Y)}, ${string.format(format, value.Z)})`;
	} else if (typeIs(value, "CFrame")) {
		const [rx, ry, rz] = value.ToOrientation();
		const rxDeg = math.deg(rx);
		const ryDeg = math.deg(ry);
		const rzDeg = math.deg(rz);
		const format = `%.${precision}f`;
		const pos = value.Position;
		return `pos=(${string.format(format, pos.X)}, ${string.format(format, pos.Y)}, ${string.format(format, pos.Z)}) rot=(${string.format(format, rxDeg)}, ${string.format(format, ryDeg)}, ${string.format(format, rzDeg)})`;
	} else {
		return tostring(value);
	}
}

/**
 * Generate points for a circle
 */
export function generateCirclePoints(center: Vector3, radius: number, normal: Vector3, segments: number): Vector3[] {
	const cf = CFrame.lookAlong(center, normal);
	const angle = (2 * math.pi) / segments;
	const points: Vector3[] = [];

	for (let i = 1; i <= segments; i++) {
		const localPoint = new Vector3(math.cos(i * angle), math.sin(i * angle), 0).mul(radius);
		const worldPoint = cf.PointToWorldSpace(localPoint);
		points.push(worldPoint);
	}

	return points;
}
