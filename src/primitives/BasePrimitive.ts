/**
 * Base class for all gizmo primitives
 */

import type { GizmosRenderConfig } from "../config/GizmosConfig";

export abstract class BasePrimitive {
	protected readonly config: GizmosRenderConfig;

	constructor(config: GizmosRenderConfig) {
		this.config = config;
	}

	/**
	 * Get the default display name for this primitive type
	 */
	getDefaultName(): string {
		return "Gizmo";
	}

	/**
	 * Get the resolved configuration for this primitive
	 */
	getConfig(): GizmosRenderConfig {
		return this.config;
	}

	/**
	 * Render this primitive using the WireframeHandleAdornment
	 * @param wfh The WireframeHandleAdornment to draw with
	 */
	abstract render(wfh: WireframeHandleAdornment): void;
}
