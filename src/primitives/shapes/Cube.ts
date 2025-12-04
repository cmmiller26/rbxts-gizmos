/**
 * Wireframe cube primitive
 */

import type { GizmosRenderConfig } from "../../config/GizmosConfig";
import { BasePrimitive } from "../BasePrimitive";

export class Cube extends BasePrimitive {
	private readonly position: Vector3 | CFrame;
	private readonly size: Vector3;

	constructor(config: GizmosRenderConfig, position: Vector3 | CFrame, size: Vector3) {
		super(config);
		this.position = position;
		this.size = size;
	}

	getDefaultName(): string {
		return "Cube";
	}

	render(wfh: WireframeHandleAdornment): void {
		const cf = typeIs(this.position, "Vector3") ? new CFrame(this.position) : this.position;
		const halfSize = this.size.mul(0.5);
		const min = halfSize.mul(-1);
		const max = halfSize;

		// 8 vertices of the cube
		const v = [
			cf.mul(min),
			cf.mul(new Vector3(max.X, min.Y, min.Z)),
			cf.mul(new Vector3(max.X, min.Y, max.Z)),
			cf.mul(new Vector3(min.X, min.Y, max.Z)),
			cf.mul(new Vector3(min.X, max.Y, min.Z)),
			cf.mul(new Vector3(max.X, max.Y, min.Z)),
			cf.mul(max),
			cf.mul(new Vector3(min.X, max.Y, max.Z)),
		];

		// 12 edges
		wfh.AddLines([
			v[0],
			v[1],
			v[1],
			v[2],
			v[2],
			v[3],
			v[3],
			v[0],
			v[4],
			v[5],
			v[5],
			v[6],
			v[6],
			v[7],
			v[7],
			v[4],
			v[0],
			v[4],
			v[1],
			v[5],
			v[2],
			v[6],
			v[3],
			v[7],
		]);
	}
}
