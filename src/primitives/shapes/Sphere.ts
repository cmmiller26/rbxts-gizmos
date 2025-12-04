/**
 * Wireframe sphere primitive (3 orthogonal circles)
 */

import { generateCirclePoints } from "../../utils/MathHelpers";
import type { GizmosRenderConfig } from "../../config/GizmosConfig";
import { BasePrimitive } from "../BasePrimitive";

export class Sphere extends BasePrimitive {
	private readonly position: Vector3 | CFrame;
	private readonly radius: number;
	private readonly segments: number;

	constructor(config: GizmosRenderConfig, position: Vector3 | CFrame, radius: number, segments: number = 16) {
		super(config);
		this.position = position;
		this.radius = radius;
		this.segments = segments;
	}

	getDefaultName(): string {
		return "Sphere";
	}

	render(wfh: WireframeHandleAdornment): void {
		const cf = typeIs(this.position, "Vector3") ? new CFrame(this.position) : this.position;
		const center = cf.Position;

		// Draw 3 orthogonal circles
		const xCircle = generateCirclePoints(center, this.radius, cf.Rotation.mul(Vector3.xAxis), this.segments);
		const yCircle = generateCirclePoints(center, this.radius, cf.Rotation.mul(Vector3.yAxis), this.segments);
		const zCircle = generateCirclePoints(center, this.radius, cf.Rotation.mul(Vector3.zAxis), this.segments);

		wfh.AddPath(xCircle, true);
		wfh.AddPath(yCircle, true);
		wfh.AddPath(zCircle, true);
	}
}
