/**
 * Gizmos - Debug drawing library for Roblox
 *
 * Original Luau implementation by sg3cko
 * https://devforum.roblox.com/t/roblox-gizmos-for-debug-drawing-now-available/3294608
 *
 * TypeScript package by Colin Miller (SnarlyZoo)
 */

interface Gizmos {
	/**
	 * Whether to automatically clear gizmos each frame
	 * @default true
	 */
	clear: boolean;

	/**
	 * Set the color for subsequent draw calls
	 * @param color Color name ('red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'orange', 'purple', 'white', 'gray', 'black') or Color3 value
	 */
	setColor(color: string | Color3): void;

	/**
	 * Set the transparency for subsequent draw calls
	 * @param value Transparency value from 0 (opaque) to 1 (fully transparent)
	 */
	setTransparency(value: number): void;

	/**
	 * Draw a line between two points
	 * @param from Start position
	 * @param to End position
	 */
	drawLine(from: Vector3, to: Vector3): void;

	/**
	 * Draw a ray with an arrow head
	 * @param origin Starting position of the ray
	 * @param direction Direction and length of the ray
	 */
	drawRay(origin: Vector3, direction: Vector3): void;

	/**
	 * Draw a path connecting multiple points
	 * @param points Array of Vector3 positions to connect
	 * @param closed Whether to connect the last point back to the first
	 * @param dotsSize Optional size of dots to draw at each point (0 = no dots)
	 */
	drawPath(points: Vector3[], closed?: boolean, dotsSize?: number): void;

	/**
	 * Draw a point marker at a position
	 * @param position Location to draw the point
	 * @param size Size of the point marker
	 */
	drawPoint(position: Vector3, size?: number): void;

	/**
	 * Draw a wireframe cube
	 * @param position Center position or CFrame of the cube
	 * @param size Size of the cube on each axis
	 */
	drawCube(position: Vector3 | CFrame, size: Vector3): void;

	/**
	 * Draw a wireframe circle
	 * @param position Center position of the circle
	 * @param radius Radius of the circle
	 * @param normal Normal vector defining the circle's plane (defaults to Vector3.yAxis)
	 */
	drawCircle(position: Vector3, radius: number, normal?: Vector3): void;

	/**
	 * Draw a wireframe sphere
	 * @param position Center position or CFrame of the sphere
	 * @param radius Radius of the sphere
	 */
	drawSphere(position: Vector3 | CFrame, radius: number): void;

	/**
	 * Draw a wireframe pyramid
	 * @param position Base center position or CFrame of the pyramid
	 * @param size Size of the pyramid's base
	 * @param height Height of the pyramid
	 */
	drawPyramid(position: Vector3 | CFrame, size: number, height: number): void;

	/**
	 * Draw a CFrame as colored axes (red = right, green = up, blue = -look)
	 * @param cf CFrame to visualize
	 * @param size Length of the axes
	 * @param color Optional single color for all axes (defaults to RGB for XYZ)
	 */
	drawCFrame(cf: CFrame, size?: number, color?: Color3): void;

	/**
	 * Draw text at a world position
	 * @param position World position to display the text
	 * @param args Values to display (strings, numbers, Vector3, CFrame are automatically formatted)
	 */
	drawText(position: Vector3, ...args: unknown[]): void;

	/**
	 * Log text to the on-screen debug display
	 * @param args Values to log (strings, numbers, Vector3, CFrame are automatically formatted)
	 */
	log(...args: unknown[]): void;

	/**
	 * Visualize a raycast with its result
	 * @param origin Starting position of the raycast
	 * @param direction Direction and maximum distance of the raycast
	 * @param result RaycastResult (green if hit, red if miss)
	 */
	drawRaycast(origin: Vector3, direction: Vector3, result: RaycastResult | undefined): void;

	/**
	 * Visualize a spherecast with its result
	 * @param origin Starting position of the spherecast
	 * @param radius Radius of the sphere
	 * @param direction Direction and maximum distance of the spherecast
	 * @param result RaycastResult (green if hit, red if miss)
	 */
	drawSpherecast(origin: Vector3, radius: number, direction: Vector3, result: RaycastResult | undefined): void;

	/**
	 * Visualize a blockcast (box-shaped raycast) with its result
	 * @param cf CFrame defining position and orientation of the block
	 * @param size Size of the block on each axis
	 * @param direction Direction and maximum distance of the blockcast
	 * @param result RaycastResult (green if hit, red if miss)
	 */
	drawBlockcast(cf: CFrame, size: Vector3, direction: Vector3, result: RaycastResult | undefined): void;

	/**
	 * Add a point to a named trailing path (useful for visualizing movement over time)
	 * @param name Unique identifier for this path
	 * @param position Position to add to the path
	 * @param dotsSize Optional size of dots to draw at each point (0 = no dots)
	 */
	addToPath(name: string, position: Vector3, dotsSize?: number): void;

	/**
	 * Manually force an update and clear of all gizmos
	 */
	forceUpdate(): void;

	/**
	 * Run a visual test showcasing all gizmo drawing functions
	 */
	test(): void;
}

declare const Gizmos: Gizmos;
export = Gizmos;
