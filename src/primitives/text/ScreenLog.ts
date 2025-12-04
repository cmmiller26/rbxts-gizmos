/**
 * On-screen log primitive
 */

import { formatValue } from "../../utils/MathHelpers";
import type { GizmosRenderConfig } from "../../config/GizmosConfig";
import { BasePrimitive } from "../BasePrimitive";
import type { RenderEngine } from "../../core/RenderEngine";

export class ScreenLog extends BasePrimitive {
	private readonly values: defined[];
	private readonly precision: number;
	private readonly renderEngine: RenderEngine;

	constructor(config: GizmosRenderConfig, values: defined[], precision: number = 3, renderEngine: RenderEngine) {
		super(config);
		this.values = values;
		this.precision = precision;
		this.renderEngine = renderEngine;
	}

	getDefaultName(): string {
		return "ScreenLog";
	}

	render(): void {
		// Format all values
		const formatted: string[] = [];
		for (const v of this.values) {
			formatted.push(formatValue(v, this.precision));
		}
		const text = formatted.join(" ");

		// Add to render engine log buffer
		this.renderEngine.addLog(text);
	}
}
