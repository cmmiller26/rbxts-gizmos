/**
 * Point marker primitive (cross-hair)
 */

import type { GizmosRenderConfig } from "../../config/GizmosConfig";
import { BasePrimitive } from "../BasePrimitive";

export class Point extends BasePrimitive {
	private readonly position: Vector3;
	private readonly size: number;

	constructor(config: GizmosRenderConfig, position: Vector3, size: number = 0.1) {
		super(config);
		this.position = position;
		this.size = size;
	}

	getDefaultName(): string {
		return "Point";
	}

	render(wfh: WireframeHandleAdornment): void {
		// Three perpendicular axes
		const pos = this.position;
		wfh.AddLines([
			pos.sub(Vector3.xAxis.mul(this.size)),
			pos.add(Vector3.xAxis.mul(this.size)),
			pos.sub(Vector3.yAxis.mul(this.size)),
			pos.add(Vector3.yAxis.mul(this.size)),
			pos.sub(Vector3.zAxis.mul(this.size)),
			pos.add(Vector3.zAxis.mul(this.size)),
		]);
	}
}
