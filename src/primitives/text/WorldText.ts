/**
 * World-space text primitive
 */

import type { GizmosRenderConfig } from "../../config/GizmosConfig";
import { BasePrimitive } from "../BasePrimitive";

export class WorldText extends BasePrimitive {
	private readonly position: Vector3;
	private readonly text: string;
	private readonly precision: number;
	private readonly fontSize?: number;

	constructor(config: GizmosRenderConfig, position: Vector3, text: string, precision: number = 3, fontSize?: number) {
		super(config);
		this.position = position;
		this.text = text;
		this.precision = precision;
		this.fontSize = fontSize;
	}

	getDefaultName(): string {
		return "WorldText";
	}

	render(wfh: WireframeHandleAdornment): void {
		// Format text if needed (in case it contains interpolated values)
		const formattedText = this.text;
		wfh.AddText(this.position, formattedText, this.fontSize);
	}
}
