/**
 * Wireframe pyramid primitive
 */

import type { GizmosRenderConfig } from "../../config/GizmosConfig";
import { BasePrimitive } from "../BasePrimitive";

export class Pyramid extends BasePrimitive {
	private readonly position: Vector3 | CFrame;
	private readonly baseSize: number;
	private readonly height: number;

	constructor(config: GizmosRenderConfig, position: Vector3 | CFrame, baseSize: number, height: number) {
		super(config);
		this.position = position;
		this.baseSize = baseSize;
		this.height = height;
	}

	getDefaultName(): string {
		return "Pyramid";
	}

	render(wfh: WireframeHandleAdornment): void {
		const cf = typeIs(this.position, "Vector3") ? new CFrame(this.position) : this.position;
		const hsize = this.baseSize / 2;

		const points = [
			cf.mul(new Vector3(hsize, 0, hsize)),
			cf.mul(new Vector3(-hsize, 0, hsize)),
			cf.mul(new Vector3(-hsize, 0, -hsize)),
			cf.mul(new Vector3(hsize, 0, -hsize)),
			cf.mul(new Vector3(0, this.height, 0)),
		];

		// Base + edges to apex
		wfh.AddPath([points[0], points[1], points[2], points[3], points[0], points[4], points[1]], false);
		wfh.AddPath([points[2], points[4], points[3]], false);
	}
}
