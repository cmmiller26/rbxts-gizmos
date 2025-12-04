/**
 * Static path primitive
 */

import type { GizmosRenderConfig } from "../../config/GizmosConfig";
import { BasePrimitive } from "../BasePrimitive";
import { Cube } from "../shapes/Cube";

export class Path extends BasePrimitive {
	private readonly points: Vector3[];
	private readonly closed: boolean;
	private readonly dotsSize: number;

	constructor(config: GizmosRenderConfig, points: Vector3[], closed: boolean = false, dotsSize: number = 0) {
		super(config);
		this.points = points;
		this.closed = closed;
		this.dotsSize = dotsSize;
	}

	getDefaultName(): string {
		return "Path";
	}

	render(wfh: WireframeHandleAdornment): void {
		// Draw path
		wfh.AddPath(this.points, this.closed);

		// Draw dots at each point if requested
		if (this.dotsSize > 0) {
			for (const point of this.points) {
				const cube = new Cube(this.config, point, new Vector3(this.dotsSize, this.dotsSize, this.dotsSize));
				cube.render(wfh);
			}
		}
	}
}
