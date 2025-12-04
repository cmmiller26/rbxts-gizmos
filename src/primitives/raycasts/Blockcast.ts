/**
 * Blockcast (box-shaped raycast) visualization primitive
 */

import { generateCirclePoints } from "../../utils/MathHelpers";
import type { GizmosRenderConfig } from "../../config/GizmosConfig";
import { BasePrimitive } from "../BasePrimitive";
import { Cube } from "../shapes/Cube";
import { Ray } from "../shapes/Ray";

export class Blockcast extends BasePrimitive {
	private readonly cframe: CFrame;
	private readonly size: Vector3;
	private readonly direction: Vector3;
	private readonly result?: RaycastResult;
	private readonly hitColor: Color3;
	private readonly missColor: Color3;
	private readonly arrowAngle: number;
	private readonly arrowLengthRatio: number;

	constructor(
		config: GizmosRenderConfig,
		cframe: CFrame,
		size: Vector3,
		direction: Vector3,
		result: RaycastResult | undefined,
		hitColor: Color3,
		missColor: Color3,
		arrowAngle: number = 30,
		arrowLengthRatio: number = 1 / 20,
	) {
		super(config);
		this.cframe = cframe;
		this.size = size;
		this.direction = direction;
		this.result = result;
		this.hitColor = hitColor;
		this.missColor = missColor;
		this.arrowAngle = arrowAngle;
		this.arrowLengthRatio = arrowLengthRatio;
	}

	getDefaultName(): string {
		return "Blockcast";
	}

	render(wfh: WireframeHandleAdornment): void {
		const originalColor = wfh.Color3;

		if (this.result) {
			// Hit
			wfh.Color3 = this.hitColor;
			const travel = this.direction.Unit.mul(this.result.Distance);

			// Cube at origin
			const originCube = new Cube(this.config, this.cframe, this.size);
			originCube.render(wfh);

			// Cube at impact
			const impactCube = new Cube(this.config, this.cframe.add(travel), this.size);
			impactCube.render(wfh);

			// Ray showing travel
			const ray = new Ray(this.config, this.cframe.Position, travel, this.arrowAngle, this.arrowLengthRatio);
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

			// Cube at origin
			const originCube = new Cube(this.config, this.cframe, this.size);
			originCube.render(wfh);

			// Cube at end
			const endCube = new Cube(this.config, this.cframe.add(this.direction), this.size);
			endCube.render(wfh);

			// Ray showing travel
			const ray = new Ray(
				this.config,
				this.cframe.Position,
				this.direction,
				this.arrowAngle,
				this.arrowLengthRatio,
			);
			ray.render(wfh);
		}

		wfh.Color3 = originalColor;
	}
}
