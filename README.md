# @rbxts/gizmos

Modern TypeScript debug visualization library for Roblox with Iris UI integration, custom groups, and per-gizmo configuration.

## Features

- **✨ Modern TypeScript API** - Fully typed with roblox-ts
- **🎨 Custom Groups** - Organize gizmos into named groups with independent controls
- **🎛️ Iris UI Integration** - Runtime configuration with immediate-mode GUI
- **⚙️ Per-Gizmo Configuration** - Configure color, transparency, and more per draw call
- **🔥 Hot Key Support** - Toggle UI with F2 (configurable)
- **📊 13 Primitive Types** - Lines, rays, shapes, raycasts, paths, and text
- **💪 Zero Hardcoded Limits** - Everything is configurable

## Installation

```bash
npm install @rbxts/gizmos
```

## Quick Start

```typescript
import Gizmos from "@rbxts/gizmos";

// Simple usage
Gizmos.drawLine(start, end);
Gizmos.drawRay(origin, direction);
Gizmos.drawSphere(position, radius);

// With inline configuration
Gizmos.drawLine(start, end, {
    color: new Color3(1, 0, 0),
    transparency: 0.5,
});

// Using groups for organization
Gizmos.createGroup("Combat", {
    color: new Color3(1, 0, 0),
    transparency: 0.3,
});

Gizmos.drawRaycast(origin, direction, result, { group: "Combat" });
Gizmos.toggleGroup("Combat"); // Toggle entire group on/off

// Show UI (press F2 by default)
Gizmos.showUI();
```

## Drawing Primitives

### Shapes

```typescript
// Line
Gizmos.drawLine(from: Vector3, to: Vector3, options?: DrawOptions);

// Ray with arrow
Gizmos.drawRay(origin: Vector3, direction: Vector3, options?: RayDrawOptions);
// Configure arrow appearance
Gizmos.drawRay(origin, direction, {
        rowAngle: 45,      // degrees
    arrowLength: 0.5     // absolute length
});

// Point marker (cross-hair)
Gizmos.drawPoint(position: Vector3, size?: number, options?: DrawOptions);

// Wireframe cube
Gizmos.drawCube(position: Vector3 | CFrame, size: Vector3, options?: DrawOptions);

// Wireframe circle
Gizmos.drawCircle(position: Vector3, radius: number, normal?: Vector3, options?: CircleDrawOptions);
// High quality circle
Gizmos.drawCircle(position, radius, undefined, { segments: 64 });

// Wireframe sphere
Gizmos.drawSphere(position: Vector3 | CFrame, radius: number, options?: CircleDrawOptions);

// Wireframe pyramid
Gizmos.drawPyramid(position: Vector3 | CFrame, baseSize: number, height: number, options?: DrawOptions);

// CFrame axes (RGB = XYZ)
Gizmos.drawCFrame(cf: CFrame, size?: number, color?: Color3, options?: DrawOptions);
```

### Raycasts

```typescript
// Visualize raycast
Gizmos.drawRaycast(origin: Vector3, direction: Vector3, result?: RaycastResult, options?: RaycastDrawOptions);

// Custom hit/miss colors
Gizmos.drawRaycast(origin, direction, result, {
    hitColor: new Color3(0, 1, 0),
    missColor: new Color3(1, 0, 0)
});

// Spherecast
Gizmos.drawSpherecast(origin: Vector3, radius: number, direction: Vector3, result?: RaycastResult, options?: RaycastDrawOptions);

// Blockcast
Gizmos.drawBlockcast(cf: CFrame, size: Vector3, direction: Vector3, result?: RaycastResult, options?: RaycastDrawOptions);
```

### Paths

```typescript
// Static path
Gizmos.drawPath(points: Vector3[], closed?: boolean, dotsSize?: number, options?: DrawOptions);

// Trailing path (follows movement)
Gizmos.addToPath("player-trail", position, options?: TrailDrawOptions);

// Configurable buffer size
Gizmos.addToPath("trail", position, {
    maxPoints: 500,  // Default: 300
    dotsSize: 0.1,
    color: new Color3(0, 1, 1)
});

// Clear/delete trails
Gizmos.clearPath("player-trail");  // Clear points
Gizmos.deletePath("player-trail"); // Delete entirely
```

### Text

```typescript
// World-space text
Gizmos.drawText(position: Vector3, text: string, options?: TextDrawOptions);

// With custom precision
Gizmos.drawText(position, `Value: ${someNumber}`, {
    precision: 5,  // 5 decimal places
    fontSize: 16
});

// On-screen log
Gizmos.log("Debug message", someValue, vector);
```

## Group Management

Groups allow you to organize gizmos and toggle them independently:

```typescript
// Create groups
Gizmos.createGroup("Combat", {
    color: new Color3(1, 0, 0),
    transparency: 0.3,
    enabled: true,
});

Gizmos.createGroup("Physics", {
    color: new Color3(0, 1, 1),
    transparency: 0.5,
});

// Assign gizmos to groups
Gizmos.drawRaycast(origin, direction, result, { group: "Combat" });
Gizmos.drawSphere(position, radius, { group: "Physics" });

// Control groups
Gizmos.enableGroup("Combat");
Gizmos.disableGroup("Combat");
Gizmos.toggleGroup("Combat");
Gizmos.isGroupEnabled("Combat");

// Configure groups
Gizmos.setGroupConfig("Combat", {
    color: new Color3(1, 1, 0),
    transparency: 0.2,
});

// Clear/delete groups
Gizmos.clearGroup("Combat"); // Remove all gizmos in group
Gizmos.deleteGroup("Combat"); // Delete group entirely

// List groups
const groups = Gizmos.listGroups();
```

## Configuration

### Global Configuration

```typescript
// Set global defaults
Gizmos.setGlobalConfig({
    color: new Color3(1, 1, 1),
    transparency: 0,
    alwaysOnTop: true,
    persistent: false,
});

const config = Gizmos.getGlobalConfig();
```

### Configuration Precedence

Configuration follows a precedence hierarchy:

```text
Command > Group > Global > Default
```

Example:

```typescript
// Global default: white
Gizmos.setGlobalConfig({ color: new Color3(1, 1, 1) });

// Group override: red
Gizmos.createGroup("Combat", { color: new Color3(1, 0, 0) });

// Command override: yellow (highest priority)
Gizmos.drawLine(start, end, {
    group: "Combat",
    color: new Color3(1, 1, 0), // This color wins
});
```

## UI Controls

The Iris UI provides runtime configuration:

```typescript
// Show/hide UI
Gizmos.showUI(); // or press F2
Gizmos.hideUI();
Gizmos.toggleUI();
Gizmos.isUIVisible();

// Change hotkey
Gizmos.setUIHotkey(Enum.KeyCode.F3);
```

**UI Features**:

- Master enable/disable toggle
- Per-group enable/disable
- Per-group color pickers
- Per-group transparency sliders
- Clear/delete group buttons
- Live statistics (active gizmo counts)
- Dynamic group creation

## Draw Options

### Base Options

```typescript
interface DrawOptions {
    enabled?: boolean;
    color?: Color3;
    transparency?: number;
    group?: string;
    alwaysOnTop?: boolean;
    persistent?: boolean;
}
```

### Ray Options

```typescript
interface RayDrawOptions extends DrawOptions {
    arrowAngle?: number; // Default: 30 degrees
    arrowLength?: number; // Default: magnitude/20
}
```

### Raycast Options

```typescript
interface RaycastDrawOptions extends DrawOptions {
    hitColor?: Color3; // Default: green
    missColor?: Color3; // Default: red
    arrowAngle?: number;
    arrowLength?: number;
}
```

### Circle/Sphere Options

```typescript
interface CircleDrawOptions extends DrawOptions {
    segments?: number; // Default: 16
}
```

### Text Options

```typescript
interface TextDrawOptions extends DrawOptions {
    precision?: number; // Default: 3 decimals
    fontSize?: number;
}
```

### Trail Options

```typescript
interface TrailDrawOptions extends DrawOptions {
    maxPoints?: number; // Default: 300
    dotsSize?: number; // Default: 0
}
```

## Examples

### Character Controller Debugging

```typescript
// Create group for player movement
Gizmos.createGroup("PlayerMovement", {
    color: new Color3(0, 1, 1),
    transparency: 0.3,
});

// Visualize ground detection
Gizmos.drawRaycast(position, Vector3.yAxis.mul(-5), groundResult, {
    group: "PlayerMovement",
});

// Show velocity
Gizmos.drawRay(position, velocity, {
    group: "PlayerMovement",
    color: new Color3(1, 1, 0),
});

// Trail player movement
Gizmos.addToPath("player", position, {
    group: "PlayerMovement",
    maxPoints: 200,
    dotsSize: 0.05,
});

// Toggle all movement debug with one call
Gizmos.toggleGroup("PlayerMovement");
```

### Combat System Visualization

````typescript
Gizmos.createGroup("Combat", {
    color: new Color3(1, 0, 0),
    transparency: 0.2,
});

// Weapon raycasts
Gizmos.drawRaycast(weaponOrigin, aimDirection, hitResult, {
    group: "Combat",
    hitColor: new Color3(1, 0.5, 0),
    missColor: new Color3(0.5, 0, 0),
});

// Hit boxes
Gizmos.drawCube(enemyPosition, hitboxSize, {
    group: "Combat",
    color: new Color3(hfinding

```typescript
Gizmos.createGrGizmos.createGroup("AI", {
    color: new Color3(1, 0, 1),
    persistent: true, // Keep paths visible
});
zmos.drawPath(pathNodes, false, 0.2, { group: "AI" });

// Current target
Gizmos.drawCFrame(targetCFrame, 2, undefined, { group: "AI" });

// Line of sight checks
for (const target of visibleTargets) {
    Gizmos.drawLine(npcPosition, target.Position, {
        group: "AI",
        color: new Color3(0, 1, 0),
    });
}
````

## Migration from v1.x

### Breaking Changes

The v2.0 API has breaking changes for a cleaner design:

**Removed**:

- `Gizmos.setColor()` - use inline `color` option
- `Gizmos.setTransparency()` - use inline `transparency` option
- `Gizmos.enabled` property - use `Gizmos.showUI()` master toggle
- `Gizmos.clear` property - automatic clearing is now default
- String-based colors (e.g., `"red"`) - use `Color3` only

**Migration Examples**:

```typescript
// v1.x
Gizmos.se// v1.x
Gizmos.setColor("red");
Gizmos.setTransparency(0.5);
Gizmos.drawLine(start, end);

// v2.0
Gizmos.drawLine(start, end, {
    color: new Color3(1, 0, 0),
    transparency: 0.5,
});

// Or use groups
Gizmos.createGroup("MyGroup", {
    color: new Color3(1, 0, 0),
    transparency: 0.5,
});
Gizmos.drawLine(start, end, { group: "MyGroup" });
e groups
Gizmos.createGroup("MyGroup", {
    color: new Color3(1, 0, 0),
    transparency: 0.5,
});
Gizmos.drawLine(start, end, { group: "MyGroup" });
```

## Performance

- **Command Buffering**: All draw calls are buffered and rendered once per frame
- **Target**: 1000+ gizmos at 60 FPS
- **Optimization**: Disable unused groups to improve performance
- **Persistent vs Transient**: Transient gizmos (default) are cleared each frame; persistent gizmos remain until explicitly cleared

## Testing

Run the built-in visual test:

```typescript
Gizmos.test();
```

This showcases all primitive types with various configurations.

## Credits

- Original Luau implementation by [sg3cko](https://devforum.roblox.com/t/roblox-gizmos-for-debug-drawing-now-available/3294608)
- TypeScript port and v2.0 rework by Colin Miller
- Iris UI by [SirMallard](https://github.com/SirMallard/Iris)

## License

MIT

## Links

- [GitHub Repository](https://github.com/cmmiller26/rbxts-gizmos)
- [npm Package](https://www.npmjs.com/package/@rbxts/gizmos)
- [Original DevForum Post](https://devforum.roblox.com/t/roblox-gizmos-for-debug-drawing-now-available/3294608)
