/**
 * Ray primitive with arrow head
 */

import { getPerpendicularVector } from "../../utils/MathHelpers";
import type { GizmosRenderConfig } from "../../config/GizmosConfig";
import { BasePrimitive } from "../BasePrimitive";

export class Ray extends BasePrimitive {
	private readonly origin: Vector3;
	private readonly direction: Vector3;
	private readonly arrowAngle: number;
	private readonly arrowLengthRatio: number;

	constructor(
		config: GizmosRenderConfig,
		origin: Vector3,
		direction: Vector3,
		arrowAngle: number = 30,
		arrowLengthRatio: number = 1 / 20,
	) {
		super(config);
		this.origin = origin;
		this.direction = direction;
		this.arrowAngle = arrowAngle;
		this.arrowLengthRatio = arrowLengthRatio;
	}

	getDefaultName(): string {
		return "Ray";
	}

	render(wfh: WireframeHandleAdornment): void {
		const endPoint = this.origin.add(this.direction);
		wfh.AddLine(this.origin, endPoint);

		// Draw arrow head
		const arrowLength = this.direction.Magnitude * this.arrowLengthRatio;
		const arrowAngleRad = math.rad(this.arrowAngle);
		const dir = this.direction.Unit;
		const perp = getPerpendicularVector(dir);

		const left = endPoint.sub(dir.mul(arrowLength)).add(perp.mul(arrowLength * math.tan(arrowAngleRad)));
		const right = endPoint.sub(dir.mul(arrowLength)).sub(perp.mul(arrowLength * math.tan(arrowAngleRad)));

		wfh.AddLine(endPoint, left);
		wfh.AddLine(endPoint, right);
	}
}
