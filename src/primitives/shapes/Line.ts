/**
 * Line primitive
 */

import type { GizmosRenderConfig } from "../../config/GizmosConfig";
import { BasePrimitive } from "../BasePrimitive";

export class Line extends BasePrimitive {
	private readonly from: Vector3;
	private readonly to: Vector3;

	constructor(config: GizmosRenderConfig, from: Vector3, to: Vector3) {
		super(config);
		this.from = from;
		this.to = to;
	}

	getDefaultName(): string {
		return "Line";
	}

	render(wfh: WireframeHandleAdornment): void {
		wfh.AddLine(this.from, this.to);
	}
}
