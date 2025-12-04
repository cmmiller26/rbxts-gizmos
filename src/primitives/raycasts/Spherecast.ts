/**
 * Spherecast visualization primitive
 */

import { generateCirclePoints } from "../../utils/MathHelpers";
import type { GizmosRenderConfig } from "../../config/GizmosConfig";
import { BasePrimitive } from "../BasePrimitive";
import { Ray } from "../shapes/Ray";
import { Sphere } from "../shapes/Sphere";

export class Spherecast extends BasePrimitive {
	private readonly origin: Vector3;
	private readonly radius: number;
	private readonly direction: Vector3;
	private readonly result?: RaycastResult;
	private readonly hitColor: Color3;
	private readonly missColor: Color3;
	private readonly arrowAngle: number;
	private readonly arrowLengthRatio: number;

	constructor(
		config: GizmosRenderConfig,
		origin: Vector3,
		radius: number,
		direction: Vector3,
		result: RaycastResult | undefined,
		hitColor: Color3,
		missColor: Color3,
		arrowAngle: number = 30,
		arrowLengthRatio: number = 1 / 20,
	) {
		super(config);
		this.origin = origin;
		this.radius = radius;
		this.direction = direction;
		this.result = result;
		this.hitColor = hitColor;
		this.missColor = missColor;
		this.arrowAngle = arrowAngle;
		this.arrowLengthRatio = arrowLengthRatio;
	}

	getDefaultName(): string {
		return "Spherecast";
	}

	render(wfh: WireframeHandleAdornment): void {
		const originalColor = wfh.Color3;
		const cf = CFrame.lookAlong(this.origin, this.direction);

		if (this.result) {
			// Hit
			wfh.Color3 = this.hitColor;
			const travel = this.direction.Unit.mul(this.result.Distance);

			// Sphere at origin
			const originSphere = new Sphere(this.config, cf, this.radius);
			originSphere.render(wfh);

			// Sphere at impact
			const impactSphere = new Sphere(this.config, cf.add(travel), this.radius);
			impactSphere.render(wfh);

			// Ray showing travel
			const ray = new Ray(this.config, cf.Position, travel, this.arrowAngle, this.arrowLengthRatio);
			ray.render(wfh);

			// Hit marker
			const hitPos = this.result.Position;
			const normal = this.result.Normal;
			const circle = generateCirclePoints(hitPos, 0.15, normal, 16);
			wfh.AddPath(circle, true);
			wfh.AddLine(hitPos, hitPos.add(normal.mul(0.3)));
		} else {
			// Miss
			wfh.Color3 = this.missColor;

			// Sphere at origin
			const originSphere = new Sphere(this.config, cf, this.radius);
			originSphere.render(wfh);

			// Sphere at end
			const endSphere = new Sphere(this.config, cf.add(this.direction), this.radius);
			endSphere.render(wfh);

			// Ray showing travel
			const ray = new Ray(this.config, cf.Position, this.direction, this.arrowAngle, this.arrowLengthRatio);
			ray.render(wfh);
		}

		wfh.Color3 = originalColor;
	}
}
