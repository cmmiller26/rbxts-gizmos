/**
 * Wireframe circle primitive
 */

import { generateCirclePoints } from "../../utils/MathHelpers";
import type { GizmosRenderConfig } from "../../config/GizmosConfig";
import { BasePrimitive } from "../BasePrimitive";

export class Circle extends BasePrimitive {
	private readonly position: Vector3;
	private readonly radius: number;
	private readonly normal: Vector3;
	private readonly segments: number;

	constructor(
		config: GizmosRenderConfig,
		position: Vector3,
		radius: number,
		normal: Vector3 = Vector3.yAxis,
		segments: number = 16,
	) {
		super(config);
		this.position = position;
		this.radius = radius;
		this.normal = normal;
		this.segments = segments;
	}

	getDefaultName(): string {
		return "Circle";
	}

	render(wfh: WireframeHandleAdornment): void {
		const points = generateCirclePoints(this.position, this.radius, this.normal, this.segments);
		wfh.AddPath(points, true);
	}
}
