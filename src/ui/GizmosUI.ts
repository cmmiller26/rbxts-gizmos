/**
 * Iris UI integration for Gizmos
 * Provides runtime controls for groups, configuration, and statistics
 */

import Iris from "@rbxts/iris";
import type { GizmosState } from "../core/GizmosState";
import type { CommandBuffer } from "../core/CommandBuffer";
import type { RenderEngine } from "../core/RenderEngine";
import type { BasePrimitive } from "../primitives/BasePrimitive";

export class GizmosUI {
	private readonly state: GizmosState;
	private readonly commandBuffer: CommandBuffer;
	private readonly renderEngine: RenderEngine;
	private initialized: boolean = false;
	private openGroupWindows: Set<string> = new Set();

	constructor(state: GizmosState, commandBuffer: CommandBuffer, renderEngine: RenderEngine) {
		this.state = state;
		this.commandBuffer = commandBuffer;
		this.renderEngine = renderEngine;
	}

	/**
	 * Initialize Iris
	 */
	initialize(): void {
		if (this.initialized) {
			return;
		}

		Iris.Init();
		this.initialized = true;

		// Connect render loop
		Iris.Connect(() => this.render());
	}

	/**
	 * Shutdown Iris
	 */
	shutdown(): void {
		if (!this.initialized) {
			return;
		}

		Iris.Shutdown();
		this.initialized = false;
	}

	/**
	 * Render the UI (called by Iris every frame)
	 */
	private render(): void {
		if (!this.state.isUIVisible()) {
			return;
		}

		// Main window
		const window = Iris.Window(["Gizmos Debug"]);

		// Sync window state with our visibility state
		if (window.uncollapsed() || window.collapsed()) {
			const isOpen = window.state.isUncollapsed.get();
			if (!isOpen) {
				this.state.setUIVisible(false);
			}
		}

		// Global controls
		this.renderGlobalControls();
		Iris.Separator();

		// Group management
		this.renderGroupManagement();
		Iris.Separator();

		// Statistics
		this.renderStatistics();

		Iris.End();

		// Render separate windows for each open group
		for (const groupName of this.openGroupWindows) {
			this.renderGroupWindow(groupName);
		}
	}

	/**
	 * Render global controls section
	 */
	private renderGlobalControls(): void {
		Iris.Text(["Global Controls"]);

		// Master enable/disable
		const masterEnabled = this.state.isMasterEnabled();
		const enableCheckbox = Iris.Checkbox(["Enable All"], {
			isChecked: masterEnabled,
		});
		if (enableCheckbox.checked() || enableCheckbox.unchecked()) {
			const newState = enableCheckbox.state.isChecked.get();
			this.state.setMasterEnabled(newState);
		}

		// Clear all button
		Iris.SameLine([]);
		const clearButton = Iris.Button(["Clear All"]);
		if (clearButton.clicked()) {
			this.commandBuffer.clearAll();
		}
		Iris.End(); // End SameLine

		// Global defaults
		Iris.Text(["Global Defaults:"]);
		Iris.Indent({});

		const globalConfig = this.state.getGlobalConfig();

		// Global color
		const colorPicker = Iris.InputColor3(["Color"], {
			color: globalConfig.color,
		});
		if (colorPicker.numberChanged()) {
			this.state.setGlobalConfig({
				color: colorPicker.state.color.get(),
			});
		}

		// Global transparency
		const transparencySlider = Iris.SliderNum(["Transparency", 0.01, 0, 1, "%.2f"], {
			number: globalConfig.transparency,
		});
		if (transparencySlider.numberChanged()) {
			this.state.setGlobalConfig({
				transparency: transparencySlider.state.number.get(),
			});
		}

		Iris.End(); // End Indent
	}

	/**
	 * Render group management section
	 */
	private renderGroupManagement(): void {
		Iris.Text(["Groups"]);

		// List all groups as buttons
		const groups = this.state.listGroups();
		for (const groupName of groups) {
			const button = Iris.Button([groupName]);
			if (button.clicked()) {
				// Toggle window open/close
				if (this.openGroupWindows.has(groupName)) {
					this.openGroupWindows.delete(groupName);
				} else {
					this.openGroupWindows.add(groupName);
				}
			}
		}

		if (groups.size() === 0) {
			Iris.Text(["No groups created yet. Create groups in code."]);
		}
	}

	/**
	 * Render a single group window
	 */
	private renderGroupWindow(groupName: string): void {
		const groupConfig = this.state.getGroupConfig(groupName);
		if (!groupConfig) {
			// Group was deleted, close the window
			this.openGroupWindows.delete(groupName);
			return;
		}

		// Separate window for this group
		const window = Iris.Window([`Group: ${groupName}`]);

		// Check if window was closed
		if (window.uncollapsed() || window.collapsed()) {
			const isOpen = window.state.isUncollapsed.get();
			if (!isOpen) {
				this.openGroupWindows.delete(groupName);
			}
		}

		// Enabled checkbox
		const enabledCheckbox = Iris.Checkbox(["Enabled"], {
			isChecked: groupConfig.enabled,
		});
		if (enabledCheckbox.checked() || enabledCheckbox.unchecked()) {
			this.state.setGroupConfig(groupName, {
				enabled: enabledCheckbox.state.isChecked.get(),
			});
		}

		// Clear button
		Iris.SameLine([]);
		const clearButton = Iris.Button(["Clear"]);
		if (clearButton.clicked()) {
			this.commandBuffer.clearGroup(groupName);
		}
		Iris.End(); // End SameLine

		Iris.Separator();

		// Color picker
		const colorPicker = Iris.InputColor3(["Color"], {
			color: groupConfig.color,
		});
		if (colorPicker.numberChanged()) {
			this.state.setGroupConfig(groupName, {
				color: colorPicker.state.color.get(),
			});
		}

		// Transparency slider
		const transparencySlider = Iris.SliderNum(["Transparency", 0.01, 0, 1, "%.2f"], {
			number: groupConfig.transparency,
		});
		if (transparencySlider.numberChanged()) {
			this.state.setGroupConfig(groupName, {
				transparency: transparencySlider.state.number.get(),
			});
		}

		Iris.Separator();

		// Stats
		const gizmoCount = this.commandBuffer.getGroupCommandCount(groupName);
		Iris.Text([`Gizmos: ${gizmoCount} active`]);

		// List all gizmos in this group, grouped by type
		const gizmos = this.commandBuffer.getGroupGizmos(groupName);
		if (gizmos.size() > 0) {
			Iris.Separator();
			Iris.Text(["Gizmos in group:"]);

			// Group gizmos by their default name (type)
			const gizmosByType = new Map<string, Map<string, BasePrimitive>>();
			for (const [displayName, primitive] of gizmos) {
				const typeName = primitive.getDefaultName();
				if (!gizmosByType.has(typeName)) {
					gizmosByType.set(typeName, new Map());
				}
				gizmosByType.get(typeName)!.set(displayName, primitive);
			}

			// Render each type group
			for (const [typeName, gizmosOfType] of gizmosByType) {
				Iris.Tree([`${typeName} (${gizmosOfType.size()})`]);

				for (const [displayName, primitive] of gizmosOfType) {
					this.renderGizmoControls(displayName, primitive);
				}

				Iris.End(); // End Tree
			}
		}

		Iris.End(); // End Window
	}

	/**
	 * Render individual gizmo controls
	 */
	private renderGizmoControls(displayName: string, primitive: BasePrimitive): void {
		const config = primitive.getConfig();

		// Tree node for individual gizmo
		Iris.Tree([displayName]);

		// Enabled checkbox
		const enabledCheckbox = Iris.Checkbox(["Enabled"], {
			isChecked: config.enabled,
		});
		if (enabledCheckbox.checked() || enabledCheckbox.unchecked()) {
			// Note: We can't directly modify individual gizmo config after creation
			// This would require storing a reference to modify it
			// For now, this shows the current state but can't be modified
			Iris.Text(["(Individual gizmo properties are read-only)"]);
		}

		// Color display (read-only)
		const colorStr = string.format(
			"Color: R=%.2f, G=%.2f, B=%.2f",
			config.color.R,
			config.color.G,
			config.color.B,
		);
		Iris.Text([colorStr]);

		// Transparency display (read-only)
		const transStr = string.format("Transparency: %.2f", config.transparency);
		Iris.Text([transStr]);

		// Group assignment
		Iris.Text([`Group: ${config.group ?? "None"}`]);

		// Persistent state
		Iris.Text([`Persistent: ${config.persistent ? "Yes" : "No"}`]);

		Iris.End(); // End Tree
	}

	/**
	 * Render statistics section
	 */
	private renderStatistics(): void {
		Iris.Text(["Statistics"]);
		const totalCount = this.commandBuffer.getCommandCount();
		Iris.Text([`Active Gizmos: ${totalCount} total`]);

		// Frame time
		const frameTime = this.renderEngine.getLastFrameTime();
		const frameTimeStr = string.format("%.2f", frameTime);
		Iris.Text([`Frame Time: ${frameTimeStr}ms`]);
	}
}
