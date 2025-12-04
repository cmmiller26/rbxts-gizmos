/**
 * CFrame visualization (RGB axes)
 */

import type { GizmosRenderConfig } from "../../config/GizmosConfig";
import { BasePrimitive } from "../BasePrimitive";

export class CFrameViz extends BasePrimitive {
	private readonly cframe: CFrame;
	private readonly size: number;
	private readonly singleColor?: Color3;

	constructor(config: GizmosRenderConfig, cframe: CFrame, size: number = 1, singleColor?: Color3) {
		super(config);
		this.cframe = cframe;
		this.size = size;
		this.singleColor = singleColor;
	}

	getDefaultName(): string {
		return "CFrameViz";
	}

	render(wfh: WireframeHandleAdornment): void {
		const pos = this.cframe.Position;
		const originalColor = wfh.Color3;

		if (this.singleColor !== undefined) {
			// Use single color for all axes
			wfh.Color3 = this.singleColor;
			wfh.AddLine(pos, pos.add(this.cframe.RightVector.mul(this.size)));
			wfh.AddLine(pos, pos.add(this.cframe.UpVector.mul(this.size)));
			wfh.AddLine(pos, pos.add(this.cframe.LookVector.mul(-this.size)));
		} else {
			// RGB for XYZ
			wfh.Color3 = new Color3(1, 0, 0);
			wfh.AddLine(pos, pos.add(this.cframe.RightVector.mul(this.size)));

			wfh.Color3 = new Color3(0, 1, 0);
			wfh.AddLine(pos, pos.add(this.cframe.UpVector.mul(this.size)));

			wfh.Color3 = new Color3(0, 0, 1);
			wfh.AddLine(pos, pos.add(this.cframe.LookVector.mul(-this.size)));
		}

		// Restore original color
		wfh.Color3 = originalColor;
	}
}
