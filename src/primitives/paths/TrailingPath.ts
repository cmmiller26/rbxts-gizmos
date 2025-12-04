/**
 * Trailing path primitive with circular buffer
 */

import type { GizmosRenderConfig } from "../../config/GizmosConfig";
import { BasePrimitive } from "../BasePrimitive";
import { Cube } from "../shapes/Cube";

/**
 * Circular buffer for trailing paths
 */
class TrailBuffer {
	private values: Vector3[] = [];
	private maxPoints: number;

	constructor(maxPoints: number = 300) {
		this.maxPoints = maxPoints;
	}

	add(point: Vector3): void {
		this.values.push(point);
		if (this.values.size() > this.maxPoints) {
			this.values.remove(0);
		}
	}

	getPoints(): Vector3[] {
		return this.values;
	}

	clear(): void {
		this.values = [];
	}

	setMaxPoints(max: number): void {
		this.maxPoints = max;
		// Trim if needed
		while (this.values.size() > this.maxPoints) {
			this.values.remove(0);
		}
	}
}

// Global trail buffers by name
const trailBuffers = new Map<string, TrailBuffer>();

export class TrailingPath extends BasePrimitive {
	private readonly name: string;
	private readonly newPoint: Vector3;
	private readonly dotsSize: number;
	private readonly maxPoints: number;

	constructor(
		config: GizmosRenderConfig,
		name: string,
		newPoint: Vector3,
		dotsSize: number = 0,
		maxPoints: number = 300,
	) {
		super(config);
		this.name = name;
		this.newPoint = newPoint;
		this.dotsSize = dotsSize;
		this.maxPoints = maxPoints;
	}

	getDefaultName(): string {
		return "TrailingPath";
	}

	render(wfh: WireframeHandleAdornment): void {
		// Get or create trail buffer
		let buffer = trailBuffers.get(this.name);
		if (!buffer) {
			buffer = new TrailBuffer(this.maxPoints);
			trailBuffers.set(this.name, buffer);
		}

		// Update buffer size if needed
		buffer.setMaxPoints(this.maxPoints);

		// Add new point
		buffer.add(this.newPoint);

		// Draw path
		const points = buffer.getPoints();
		if (points.size() > 1) {
			wfh.AddPath(points, false);
		}

		// Draw dots at each point if requested
		if (this.dotsSize > 0) {
			for (const point of points) {
				const cube = new Cube(this.config, point, new Vector3(this.dotsSize, this.dotsSize, this.dotsSize));
				cube.render(wfh);
			}
		}
	}

	static clearTrail(name: string): void {
		const buffer = trailBuffers.get(name);
		if (buffer) {
			buffer.clear();
		}
	}

	static deleteTrail(name: string): void {
		trailBuffers.delete(name);
	}
}
