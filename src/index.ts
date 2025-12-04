/**
 * Gizmos - Debug drawing library for Roblox
 * TypeScript implementation with group-based organization
 */

import { CommandBuffer } from "./core/CommandBuffer";
import { GizmosState } from "./core/GizmosState";
import { RenderEngine } from "./core/RenderEngine";
import { Blockcast } from "./primitives/raycasts/Blockcast";
import { Raycast } from "./primitives/raycasts/Raycast";
import { Spherecast } from "./primitives/raycasts/Spherecast";
import { CFrameViz } from "./primitives/shapes/CFrameViz";
import { Circle } from "./primitives/shapes/Circle";
import { Cube } from "./primitives/shapes/Cube";
import { Line } from "./primitives/shapes/Line";
import { Point } from "./primitives/shapes/Point";
import { Pyramid } from "./primitives/shapes/Pyramid";
import { Ray } from "./primitives/shapes/Ray";
import { Sphere } from "./primitives/shapes/Sphere";
import { Path } from "./primitives/paths/Path";
import { TrailingPath } from "./primitives/paths/TrailingPath";
import { ScreenLog } from "./primitives/text/ScreenLog";
import { WorldText } from "./primitives/text/WorldText";
import { GizmosUI } from "./ui/GizmosUI";
import type {
	CircleDrawOptions,
	DrawOptions,
	GizmosGroup,
	GizmosRenderConfig,
	RaycastDrawOptions,
	RayDrawOptions,
	TextDrawOptions,
	TrailDrawOptions,
} from "./config/GizmosConfig";

// Singleton instances
const state = GizmosState.getInstance();
const commandBuffer = new CommandBuffer();
const renderEngine = new RenderEngine();
const gizmosUI = new GizmosUI(state, commandBuffer, renderEngine);

// Initialize
renderEngine.initialize();
gizmosUI.initialize();

// Default raycast colors
const DEFAULT_HIT_COLOR = new Color3(0, 1, 0);
const DEFAULT_MISS_COLOR = new Color3(1, 0, 0);

// ========================================================================
// Configuration API
// ========================================================================

/**
 * Set global default configuration
 */
export function setGlobalConfig(config: Partial<GizmosRenderConfig>): void {
	state.setGlobalConfig(config);
}

/**
 * Get global configuration
 */
export function getGlobalConfig(): GizmosRenderConfig {
	return state.getGlobalConfig();
}

// ========================================================================
// Group Management API
// ========================================================================

/**
 * Create a new group with optional configuration
 */
export function createGroup(name: string, config?: Partial<GizmosRenderConfig>): void {
	state.createGroup(name, config);
}

/**
 * Delete a group
 */
export function deleteGroup(name: string): void {
	state.deleteGroup(name);
	commandBuffer.clearGroup(name);
}

/**
 * Get group information
 */
export function getGroup(name: string): GizmosGroup | undefined {
	return state.getGroup(name);
}

/**
 * List all group names
 */
export function listGroups(): string[] {
	return state.listGroups();
}

/**
 * Set configuration for a group
 */
export function setGroupConfig(name: string, config: Partial<GizmosRenderConfig>): void {
	state.setGroupConfig(name, config);
}

/**
 * Get configuration for a group
 */
export function getGroupConfig(name: string): GizmosRenderConfig | undefined {
	return state.getGroupConfig(name);
}

/**
 * Enable a group
 */
export function enableGroup(name: string): void {
	state.setGroupConfig(name, { enabled: true });
}

/**
 * Disable a group
 */
export function disableGroup(name: string): void {
	state.setGroupConfig(name, { enabled: false });
}

/**
 * Toggle a group's enabled state
 */
export function toggleGroup(name: string): void {
	const enabled = state.isGroupEnabled(name);
	state.setGroupConfig(name, { enabled: !enabled });
}

/**
 * Check if a group is enabled
 */
export function isGroupEnabled(name: string): boolean {
	return state.isGroupEnabled(name);
}

/**
 * Clear all gizmos in a group
 */
export function clearGroup(name: string): void {
	commandBuffer.clearGroup(name);
}

/**
 * Clear all gizmos (transient and persistent)
 */
export function clearAll(): void {
	commandBuffer.clearAll();
	renderEngine.clearLog();
}

// ========================================================================
// UI Control API
// ========================================================================

/**
 * Show the UI
 */
export function showUI(): void {
	state.setUIVisible(true);
}

/**
 * Hide the UI
 */
export function hideUI(): void {
	state.setUIVisible(false);
}

/**
 * Toggle UI visibility
 */
export function toggleUI(): void {
	const visible = state.isUIVisible();
	state.setUIVisible(!visible);
}

/**
 * Check if UI is visible
 */
export function isUIVisible(): boolean {
	return state.isUIVisible();
}

/**
 * Set the UI toggle hotkey
 */
export function setUIHotkey(key: Enum.KeyCode): void {
	state.setUIHotkey(key);
}

// ========================================================================
// Drawing API - Shapes
// ========================================================================

/**
 * Draw a line between two points
 */
export function drawLine(from: Vector3, to: Vector3, options?: DrawOptions): void {
	const config = state.resolveConfig(options);
	const primitive = new Line(config, from, to);
	commandBuffer.addCommand(primitive);
}

/**
 * Draw a ray with arrow head
 */
export function drawRay(origin: Vector3, direction: Vector3, options?: RayDrawOptions): void {
	const config = state.resolveConfig(options);
	const arrowAngle = options?.arrowAngle ?? 30;
	const arrowLength = options?.arrowLength ?? 1 / 20;
	const primitive = new Ray(config, origin, direction, arrowAngle, arrowLength);
	commandBuffer.addCommand(primitive);
}

/**
 * Draw a point marker
 */
export function drawPoint(position: Vector3, size?: number, options?: DrawOptions): void {
	const config = state.resolveConfig(options);
	const primitive = new Point(config, position, size ?? 0.1);
	commandBuffer.addCommand(primitive);
}

/**
 * Draw a wireframe cube
 */
export function drawCube(position: Vector3 | CFrame, size: Vector3, options?: DrawOptions): void {
	const config = state.resolveConfig(options);
	const primitive = new Cube(config, position, size);
	commandBuffer.addCommand(primitive);
}

/**
 * Draw a wireframe circle
 */
export function drawCircle(position: Vector3, radius: number, normal?: Vector3, options?: CircleDrawOptions): void {
	const config = state.resolveConfig(options);
	const segments = options?.segments ?? 16;
	const primitive = new Circle(config, position, radius, normal || Vector3.yAxis, segments);
	commandBuffer.addCommand(primitive);
}

/**
 * Draw a wireframe sphere
 */
export function drawSphere(position: Vector3 | CFrame, radius: number, options?: CircleDrawOptions): void {
	const config = state.resolveConfig(options);
	const segments = options?.segments ?? 16;
	const primitive = new Sphere(config, position, radius, segments);
	commandBuffer.addCommand(primitive);
}

/**
 * Draw a wireframe pyramid
 */
export function drawPyramid(position: Vector3 | CFrame, baseSize: number, height: number, options?: DrawOptions): void {
	const config = state.resolveConfig(options);
	const primitive = new Pyramid(config, position, baseSize, height);
	commandBuffer.addCommand(primitive);
}

/**
 * Draw a CFrame as colored axes (RGB for XYZ)
 */
export function drawCFrame(cf: CFrame, size?: number, color?: Color3, options?: DrawOptions): void {
	const config = state.resolveConfig(options);
	const primitive = new CFrameViz(config, cf, size ?? 1, color);
	commandBuffer.addCommand(primitive);
}

// ========================================================================
// Drawing API - Raycasts
// ========================================================================

/**
 * Visualize a raycast
 */
export function drawRaycast(
	origin: Vector3,
	direction: Vector3,
	result?: RaycastResult,
	options?: RaycastDrawOptions,
): void {
	const config = state.resolveConfig(options);
	const hitColor = options?.hitColor ?? DEFAULT_HIT_COLOR;
	const missColor = options?.missColor ?? DEFAULT_MISS_COLOR;
	const arrowAngle = options?.arrowAngle ?? 30;
	const arrowLength = options?.arrowLength ?? 1 / 20;
	const primitive = new Raycast(config, origin, direction, result, hitColor, missColor, arrowAngle, arrowLength);
	commandBuffer.addCommand(primitive);
}

/**
 * Visualize a spherecast
 */
export function drawSpherecast(
	origin: Vector3,
	radius: number,
	direction: Vector3,
	result?: RaycastResult,
	options?: RaycastDrawOptions,
): void {
	const config = state.resolveConfig(options);
	const hitColor = options?.hitColor ?? DEFAULT_HIT_COLOR;
	const missColor = options?.missColor ?? DEFAULT_MISS_COLOR;
	const arrowAngle = options?.arrowAngle ?? 30;
	const arrowLength = options?.arrowLength ?? 1 / 20;
	const primitive = new Spherecast(
		config,
		origin,
		radius,
		direction,
		result,
		hitColor,
		missColor,
		arrowAngle,
		arrowLength,
	);
	commandBuffer.addCommand(primitive);
}

/**
 * Visualize a blockcast
 */
export function drawBlockcast(
	cf: CFrame,
	size: Vector3,
	direction: Vector3,
	result?: RaycastResult,
	options?: RaycastDrawOptions,
): void {
	const config = state.resolveConfig(options);
	const hitColor = options?.hitColor ?? DEFAULT_HIT_COLOR;
	const missColor = options?.missColor ?? DEFAULT_MISS_COLOR;
	const arrowAngle = options?.arrowAngle ?? 30;
	const arrowLength = options?.arrowLength ?? 1 / 20;
	const primitive = new Blockcast(config, cf, size, direction, result, hitColor, missColor, arrowAngle, arrowLength);
	commandBuffer.addCommand(primitive);
}

// ========================================================================
// Drawing API - Paths
// ========================================================================

/**
 * Draw a path connecting multiple points
 */
export function drawPath(points: Vector3[], closed?: boolean, dotsSize?: number, options?: DrawOptions): void {
	const config = state.resolveConfig(options);
	const primitive = new Path(config, points, closed ?? false, dotsSize ?? 0);
	commandBuffer.addCommand(primitive);
}

/**
 * Add a point to a trailing path
 */
export function addToPath(name: string, position: Vector3, options?: TrailDrawOptions): void {
	const config = state.resolveConfig(options);
	const maxPoints = options?.maxPoints ?? 300;
	const dotsSize = options?.dotsSize ?? 0;
	const primitive = new TrailingPath(config, name, position, dotsSize, maxPoints);
	commandBuffer.addCommand(primitive);
}

/**
 * Clear a specific trailing path
 */
export function clearPath(name: string): void {
	TrailingPath.clearTrail(name);
}

/**
 * Delete a trailing path
 */
export function deletePath(name: string): void {
	TrailingPath.deleteTrail(name);
}

// ========================================================================
// Drawing API - Text
// ========================================================================

/**
 * Draw text at a world position
 */
export function drawText(position: Vector3, text: string, options?: TextDrawOptions): void {
	const config = state.resolveConfig(options);
	const precision = options?.precision ?? 3;
	const fontSize = options?.fontSize;
	const primitive = new WorldText(config, position, text, precision, fontSize);
	commandBuffer.addCommand(primitive);
}

/**
 * Log text to the on-screen display
 */
export function log(...args: defined[]): void {
	const config = state.resolveConfig();
	const precision = 3;
	const primitive = new ScreenLog(config, args, precision, renderEngine);
	commandBuffer.addCommand(primitive);
}

// ========================================================================
// Update Loop
// ========================================================================

/**
 * Render all gizmos (called by RenderStep)
 */
function update(): void {
	const masterEnabled = state.isMasterEnabled();

	// Render all commands
	renderEngine.render(commandBuffer, masterEnabled);

	// Clear transient commands
	commandBuffer.clearTransient();
}

// Bind to RenderStep
const RunService = game.GetService("RunService");
if (RunService.IsRunning()) {
	RunService.BindToRenderStep("GizmosUpdate", Enum.RenderPriority.Camera.Value - 1, update);
}

// Setup hotkey listener (F2 by default)
const UserInputService = game.GetService("UserInputService");
UserInputService.InputBegan.Connect((input, gameProcessed) => {
	if (gameProcessed) return;

	const hotkey = state.getUIHotkey();
	if (input.KeyCode === hotkey) {
		toggleUI();
	}
});

// ========================================================================
// Utility / Testing
// ========================================================================

/**
 * Run a visual test showcasing all gizmo features
 */
export function test(): void {
	let p = new Vector3(0, 0, 10);
	const x = Vector3.xAxis;
	const y = Vector3.yAxis;
	const z = Vector3.zAxis;

	const advance = () => {
		p = p.add(new Vector3(2, 0, 0));
	};

	drawLine(p, p.add(y));
	advance();

	drawRay(p, y);
	advance();

	drawPath([
		p.add(new Vector3(-0.3, 0, -0.3)),
		p.add(new Vector3(0.4, 0, 0)),
		p.add(new Vector3(0.1, 0, 0.5)),
		p.add(new Vector3(0.6, 0, 0.9)),
	]);
	advance();

	drawPoint(p);
	advance();

	drawCube(p.add(y.mul(0.5)), new Vector3(1, 1, 1));
	advance();

	drawCircle(p, 0.5);
	advance();

	drawSphere(p.add(y.mul(0.5)), 0.5);
	advance();

	drawPyramid(p, 1, 1);
	advance();

	drawCFrame(new CFrame(p));
	advance();

	drawText(p, "Hello");
	advance();

	drawRaycast(p, z);
	advance();

	drawSpherecast(p, 0.3, z);
	advance();

	drawBlockcast(new CFrame(p), new Vector3(0.6, 0.6, 0.6), z);
	advance();

	log("Test completed!");

	// Color test
	const colors = [
		new Color3(1, 0, 0),
		new Color3(1, 0.5, 0),
		new Color3(1, 1, 0),
		new Color3(0, 1, 0),
		new Color3(0, 1, 1),
		new Color3(0, 0, 1),
		new Color3(0.5, 0, 1),
		new Color3(1, 0, 1),
		new Color3(0, 0, 0),
		new Color3(0.5, 0.5, 0.5),
		new Color3(1, 1, 1),
	];

	p = new Vector3(0, 0, 12);
	for (const color of colors) {
		drawCircle(p, 0.15, undefined, { color });
		p = p.add(x.mul(1));
	}
}
