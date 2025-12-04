/**
 * Command buffering system for deferred rendering
 */

import type { BasePrimitive } from "../primitives/BasePrimitive";

interface DrawCommand {
	primitive: BasePrimitive;
	timestamp: number;
}

export class CommandBuffer {
	private transientCommands: DrawCommand[] = [];
	private persistentCommands: Map<string, DrawCommand[]> = new Map();

	/**
	 * Add a command to the buffer
	 */
	addCommand(primitive: BasePrimitive): void {
		const config = primitive.getConfig();
		const command: DrawCommand = {
			primitive,
			timestamp: tick(),
		};

		if (config.persistent) {
			// Persistent commands stored by group
			const group = config.group ?? "_default";
			if (!this.persistentCommands.has(group)) {
				this.persistentCommands.set(group, []);
			}
			this.persistentCommands.get(group)!.push(command);
		} else {
			// Transient commands cleared each frame
			this.transientCommands.push(command);
		}
	}

	/**
	 * Get all commands that should be rendered
	 */
	getCommandsToRender(): DrawCommand[] {
		const allCommands: DrawCommand[] = [];

		// Add transient commands
		for (const cmd of this.transientCommands) {
			allCommands.push(cmd);
		}

		// Add all persistent commands
		for (const [, commands] of this.persistentCommands) {
			for (const cmd of commands) {
				allCommands.push(cmd);
			}
		}

		return allCommands;
	}

	/**
	 * Clear transient commands (called each frame)
	 */
	clearTransient(): void {
		this.transientCommands = [];
	}

	/**
	 * Clear all commands in a specific group
	 */
	clearGroup(group: string): void {
		this.persistentCommands.delete(group);

		// Also remove transient commands in this group
		this.transientCommands = this.transientCommands.filter((cmd) => cmd.primitive.getConfig().group !== group);
	}

	/**
	 * Clear all commands (transient and persistent)
	 */
	clearAll(): void {
		this.transientCommands = [];
		this.persistentCommands.clear();
	}

	/**
	 * Get count of active commands (for stats)
	 */
	getCommandCount(): number {
		let count = this.transientCommands.size();

		for (const [, commands] of this.persistentCommands) {
			count += commands.size();
		}

		return count;
	}

	/**
	 * Get count of commands in a specific group
	 */
	getGroupCommandCount(group: string): number {
		const persistent = this.persistentCommands.get(group)?.size() ?? 0;
		const transient = this.transientCommands.filter((cmd) => cmd.primitive.getConfig().group === group).size();
		return persistent + transient;
	}

	/**
	 * Get all named gizmos in a specific group
	 * Returns a map of display name to primitive
	 */
	getGroupGizmos(group: string): Map<string, BasePrimitive> {
		const gizmos = new Map<string, BasePrimitive>();

		// Add persistent commands from this group
		const persistentCmds = this.persistentCommands.get(group);
		if (persistentCmds) {
			for (const cmd of persistentCmds) {
				const config = cmd.primitive.getConfig();
				const displayName = config.name ?? cmd.primitive.getDefaultName();
				gizmos.set(displayName, cmd.primitive);
			}
		}

		// Add transient commands from this group
		for (const cmd of this.transientCommands) {
			if (cmd.primitive.getConfig().group === group) {
				const config = cmd.primitive.getConfig();
				const displayName = config.name ?? cmd.primitive.getDefaultName();
				gizmos.set(displayName, cmd.primitive);
			}
		}

		return gizmos;
	}
}
