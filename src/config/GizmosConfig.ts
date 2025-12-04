/**
 * Configuration interfaces and types for Gizmos
 */

export interface GizmosRenderConfig {
	enabled: boolean;
	color: Color3;
	transparency: number;
	group?: string;
	name?: string;
	alwaysOnTop: boolean;
	persistent: boolean;
}

export const DEFAULT_CONFIG: GizmosRenderConfig = {
	enabled: true,
	color: new Color3(1, 1, 1),
	transparency: 0,
	group: undefined,
	name: undefined,
	alwaysOnTop: true,
	persistent: false,
};

export type DrawOptions = Partial<GizmosRenderConfig>;

export interface RayDrawOptions extends DrawOptions {
	arrowAngle?: number;
	arrowLength?: number;
}

export interface RaycastDrawOptions extends DrawOptions {
	hitColor?: Color3;
	missColor?: Color3;
	arrowAngle?: number;
	arrowLength?: number;
}

export interface CircleDrawOptions extends DrawOptions {
	segments?: number;
}

export interface TextDrawOptions extends DrawOptions {
	precision?: number;
	fontSize?: number;
}

export interface TrailDrawOptions extends DrawOptions {
	maxPoints?: number;
	dotsSize?: number;
}

export interface GizmosGroup {
	name: string;
	config: GizmosRenderConfig;
}
