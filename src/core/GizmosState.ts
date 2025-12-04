/**
 * Central state management for Gizmos
 * Singleton pattern for global configuration
 */

import { DEFAULT_CONFIG, type DrawOptions, type GizmosGroup, type GizmosRenderConfig } from "../config/GizmosConfig";

export class GizmosState {
	private static instance: GizmosState;
	private globalConfig: GizmosRenderConfig;
	private groups: Map<string, GizmosRenderConfig>;
	private uiVisible: boolean;
	private uiHotkey: Enum.KeyCode;
	private masterEnabled: boolean;

	private constructor() {
		this.globalConfig = { ...DEFAULT_CONFIG };
		this.groups = new Map();
		this.uiVisible = false;
		this.uiHotkey = Enum.KeyCode.F2;
		this.masterEnabled = false;
	}

	static getInstance(): GizmosState {
		if (!GizmosState.instance) {
			GizmosState.instance = new GizmosState();
		}
		return GizmosState.instance;
	}

	/**
	 * Resolve configuration with precedence: Command > Group > Global > Default
	 */
	resolveConfig(commandConfig?: DrawOptions): GizmosRenderConfig {
		let resolved: GizmosRenderConfig = { ...DEFAULT_CONFIG };

		// Apply global config
		resolved = { ...resolved, ...this.globalConfig };

		// Apply group config if specified
		if (commandConfig?.group !== undefined) {
			const groupConfig = this.groups.get(commandConfig.group);
			if (groupConfig !== undefined) {
				resolved = { ...resolved, ...groupConfig };
			}
		}

		// Apply command config (highest priority)
		if (commandConfig !== undefined) {
			resolved = { ...resolved, ...commandConfig };
		}

		return resolved;
	}

	setGlobalConfig(config: Partial<GizmosRenderConfig>): void {
		this.globalConfig = { ...this.globalConfig, ...config };
	}

	getGlobalConfig(): GizmosRenderConfig {
		return { ...this.globalConfig };
	}

	createGroup(name: string, config?: Partial<GizmosRenderConfig>): void {
		const groupConfig: GizmosRenderConfig = { ...this.globalConfig, ...config };
		this.groups.set(name, groupConfig);
	}

	deleteGroup(name: string): void {
		this.groups.delete(name);
	}

	getGroup(name: string): GizmosGroup | undefined {
		const config = this.groups.get(name);
		if (config === undefined) {
			return undefined;
		}
		return { name, config };
	}

	listGroups(): string[] {
		const keys: string[] = [];
		for (const [key] of this.groups) {
			keys.push(key);
		}
		return keys;
	}

	setGroupConfig(name: string, config: Partial<GizmosRenderConfig>): void {
		const existing = this.groups.get(name);
		if (existing !== undefined) {
			this.groups.set(name, { ...existing, ...config });
		}
	}

	getGroupConfig(name: string): GizmosRenderConfig | undefined {
		return this.groups.get(name);
	}

	isGroupEnabled(name: string): boolean {
		const config = this.groups.get(name);
		return config !== undefined ? config.enabled : false;
	}

	isUIVisible(): boolean {
		return this.uiVisible;
	}

	setUIVisible(visible: boolean): void {
		this.uiVisible = visible;
	}

	getUIHotkey(): Enum.KeyCode {
		return this.uiHotkey;
	}

	setUIHotkey(key: Enum.KeyCode): void {
		this.uiHotkey = key;
	}

	isMasterEnabled(): boolean {
		return this.masterEnabled;
	}

	setMasterEnabled(enabled: boolean): void {
		this.masterEnabled = enabled;
	}
}
