/**
 * Rendering engine using WireframeHandleAdornment
 */

import type { CommandBuffer } from "./CommandBuffer";

export class RenderEngine {
	private wfh?: WireframeHandleAdornment;
	private labelGui?: TextLabel;
	private logBuffer: string[] = [];
	private lastUpdateTime: number = 0;
	private lastFrameTime: number = 0;

	/**
	 * Initialize the rendering engine
	 */
	initialize(): void {
		this.wfh = this.findOrCreateWireframe();
		this.labelGui = this.findOrCreateLabel();
	}

	/**
	 * Render all commands from the buffer
	 */
	render(commandBuffer: CommandBuffer, masterEnabled: boolean): void {
		if (!this.wfh) {
			return;
		}

		const startTime = os.clock();
		const currentTime = tick();

		// Skip if already updated this tick
		if (currentTime === this.lastUpdateTime) {
			return;
		}

		this.lastUpdateTime = currentTime;

		// Clear previous frame
		this.wfh.Clear();
		this.logBuffer = [];

		// Get all commands to render
		const commands = commandBuffer.getCommandsToRender();

		// Render each command
		for (const command of commands) {
			const primitive = command.primitive;
			const config = primitive.getConfig();

			// Check if enabled
			// Config.enabled includes group enabled state from resolveConfig
			// Only render if BOTH master is enabled AND config (group+individual) is enabled
			const shouldRender = masterEnabled && config.enabled;
			if (!shouldRender) {
				continue;
			}

			// Apply visual properties
			this.wfh.Color3 = config.color;
			this.wfh.Transparency = config.transparency;

			// Render primitive
			primitive.render(this.wfh);
		}

		// Update log display
		if (this.labelGui) {
			this.labelGui.Text = this.logBuffer.join("\n");
		}

		// Calculate frame time
		const endTime = os.clock();
		this.lastFrameTime = (endTime - startTime) * 1000; // Convert to milliseconds
	}

	/**
	 * Add text to the log buffer
	 */
	addLog(text: string): void {
		this.logBuffer.push(text);
	}

	/**
	 * Clear the log display
	 */
	clearLog(): void {
		this.logBuffer = [];
		if (this.labelGui) {
			this.labelGui.Text = "";
		}
	}

	/**
	 * Get the last frame render time in milliseconds
	 */
	getLastFrameTime(): number {
		return this.lastFrameTime;
	}

	/**
	 * Find or create the WireframeHandleAdornment
	 */
	private findOrCreateWireframe(): WireframeHandleAdornment {
		let wfh = game.Workspace.FindFirstChild("Gizmos") as WireframeHandleAdornment | undefined;

		if (!wfh) {
			wfh = new Instance("WireframeHandleAdornment");
			wfh.Name = "Gizmos";
			wfh.Parent = game.Workspace;
			assert(game.Workspace.WorldPivot.FuzzyEq(new CFrame()), "workspace is expected to have identity CFrame");
			wfh.Color3 = new Color3(1, 1, 1);
			wfh.Adornee = game.Workspace;
			wfh.AlwaysOnTop = true;
		}

		return wfh;
	}

	/**
	 * Find or create the on-screen log label
	 */
	private findOrCreateLabel(): TextLabel | undefined {
		const gui = this.getGui();
		if (!gui) {
			return undefined;
		}

		let label = gui.FindFirstChild("TextLabelGizmos", true) as TextLabel | undefined;

		if (!label) {
			const screenGui = new Instance("ScreenGui");
			screenGui.Name = "ScreenGuiGizmos";
			screenGui.Parent = gui;

			label = new Instance("TextLabel");
			label.Name = "TextLabelGizmos";
			label.BackgroundTransparency = 1;
			label.Position = new UDim2(0, 10, 1, -10);
			label.AnchorPoint = new Vector2(0, 1);
			label.TextXAlignment = Enum.TextXAlignment.Left;
			label.TextYAlignment = Enum.TextYAlignment.Bottom;
			label.FontFace = Font.fromEnum(Enum.Font.RobotoMono);
			label.TextColor3 = new Color3(1, 1, 1);
			label.TextStrokeColor3 = new Color3(0, 0, 0);
			label.TextStrokeTransparency = 0.5;
			label.TextSize = 14;
			label.AutomaticSize = Enum.AutomaticSize.XY;
			label.Parent = screenGui;
		}

		return label;
	}

	/**
	 * Get the appropriate GUI container
	 */
	private getGui(): PlayerGui | StarterGui | undefined {
		const localPlayer = game.GetService("Players").LocalPlayer;
		if (localPlayer) {
			return localPlayer.WaitForChild("PlayerGui", 3) as PlayerGui | undefined;
		} else {
			return game.GetService("StarterGui");
		}
	}
}
