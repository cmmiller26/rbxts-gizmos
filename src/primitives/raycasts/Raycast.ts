/**
 * Raycast visualization primitive
 */

import { generateCirclePoints } from "../../utils/MathHelpers";
import type { GizmosRenderConfig } from "../../config/GizmosConfig";
import { BasePrimitive } from "../BasePrimitive";
import { Ray } from "../shapes/Ray";

export class Raycast extends BasePrimitive {
	private readonly origin: Vector3;
	private readonly direction: Vector3;
	private readonly result?: RaycastResult;
	private readonly hitColor: Color3;
	private readonly missColor: Color3;
	private readonly arrowAngle: number;
	private readonly arrowLengthRatio: number;

	constructor(
		config: GizmosRenderConfig,
		origin: Vector3,
		direction: Vector3,
		result: RaycastResult | undefined,
		hitColor: Color3,
		missColor: Color3,
		arrowAngle: number = 30,
		arrowLengthRatio: number = 1 / 20,
	) {
		super(config);
		this.origin = origin;
		this.direction = direction;
		this.result = result;
		this.hitColor = hitColor;
		this.missColor = missColor;
		this.arrowAngle = arrowAngle;
		this.arrowLengthRatio = arrowLengthRatio;
	}

	getDefaultName(): string {
		return "Raycast";
	}

	render(wfh: WireframeHandleAdornment): void {
		const originalColor = wfh.Color3;

		if (this.result) {
			// Hit - draw to hit point
			wfh.Color3 = this.hitColor;

			const travel = this.direction.Unit.mul(this.result.Distance);

			// Draw ray to hit point
			const ray = new Ray(this.config, this.origin, travel, this.arrowAngle, this.arrowLengthRatio);
			ray.render(wfh);

			// Draw hit marker (circle + normal)
			const hitPos = this.result.Position;
			const normal = this.result.Normal;
			const circle = generateCirclePoints(hitPos, 0.15, normal, 16);
			wfh.AddPath(circle, true);
			wfh.AddLine(hitPos, hitPos.add(normal.mul(0.3)));
		} else {
			// Miss - draw full ray
			wfh.Color3 = this.missColor;
			const ray = new Ray(this.config, this.origin, this.direction, this.arrowAngle, this.arrowLengthRatio);
			ray.render(wfh);
		}

		wfh.Color3 = originalColor;
	}
}
