# @rbxts/gizmos

Debug drawing library for Roblox with support for lines, rays, shapes, raycasts, and more.

## Credits

Original Luau implementation by **sg3cko**  
[DevForum Post](https://devforum.roblox.com/t/roblox-gizmos-for-debug-drawing-now-available/3294608)

TypeScript package by Colin Miller (SnarlyZoo)

## Installation

```bash
npm install @rbxts/gizmos
```

## Usage

```typescript
import Gizmos from "@rbxts/gizmos";

// Draw colored shapes
Gizmos.setColor("red");
Gizmos.drawLine(Vector3.zero, new Vector3(0, 10, 0));

Gizmos.setColor("blue");
Gizmos.drawSphere(new Vector3(5, 5, 5), 2);

// Visualize raycasts
const params = new RaycastParams();
const result = workspace.Raycast(origin, direction, params);
Gizmos.drawRaycast(origin, direction, result);

// Draw text in world space
Gizmos.drawText(new Vector3(0, 10, 0), "Player spawn point");

// Log to screen
Gizmos.log("Frame:", tick());
```

## Features

- **Shapes**: Lines, rays, paths, points, cubes, circles, spheres, pyramids
- **Raycasts**: Visualize raycasts, spherecasts, and blockcasts with hit detection
- **Text**: World-space and on-screen text rendering
- **Colors**: Built-in color presets (red, green, blue, yellow, cyan, magenta, orange, purple, white, gray, black)
- **Trailing paths**: Track object movement over time
- **Auto-clearing**: Automatically clears each frame (configurable)

## API

### Drawing

- `setColor(color: string | Color3)` - Set drawing color
- `setTransparency(value: number)` - Set transparency (0-1)
- `drawLine(from: Vector3, to: Vector3)` - Draw a line
- `drawRay(origin: Vector3, direction: Vector3)` - Draw a ray with arrow
- `drawPath(points: Vector3[], closed?: boolean, dotsSize?: number)` - Draw connected path
- `drawPoint(position: Vector3, size?: number)` - Draw point marker
- `drawCube(position: Vector3 | CFrame, size: Vector3)` - Draw wireframe cube
- `drawCircle(position: Vector3, radius: number, normal?: Vector3)` - Draw circle
- `drawSphere(position: Vector3 | CFrame, radius: number)` - Draw sphere
- `drawPyramid(position: Vector3 | CFrame, size: number, height: number)` - Draw pyramid
- `drawCFrame(cf: CFrame, size?: number, color?: Color3)` - Draw CFrame axes

### Raycasts

- `drawRaycast(origin: Vector3, direction: Vector3, result?: RaycastResult)` - Visualize raycast
- `drawSpherecast(origin: Vector3, radius: number, direction: Vector3, result?: RaycastResult)` - Visualize spherecast
- `drawBlockcast(cf: CFrame, size: Vector3, direction: Vector3, result?: RaycastResult)` - Visualize blockcast

### Text & Logging

- `drawText(position: Vector3, ...args: unknown[])` - Draw text at world position
- `log(...args: unknown[])` - Log to on-screen display

### Utilities

- `addToPath(name: string, position: Vector3, dotsSize?: number)` - Add point to trailing path
- `forceUpdate()` - Manually clear and update gizmos
- `test()` - Run visual test of all features

### Properties

- `clear: boolean` - Auto-clear each frame (default: true)

## License

MIT

## Links

- [Original DevForum Post](https://devforum.roblox.com/t/roblox-gizmos-for-debug-drawing-now-available/3294608)
- [GitHub Repository](https://github.com/cmmiller26/rbxts-gizmos)
