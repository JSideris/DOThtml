import type { ComponentVdom } from "./vdom-nodes/component-vdom";

const registry = new Map<string, Set<ComponentVdom>>();

export function registerInstance(id: string, instance: ComponentVdom) {
	if (!registry.has(id)) registry.set(id, new Set());
	registry.get(id)!.add(instance);
}

export function unregisterInstance(id: string, instance: ComponentVdom) {
	registry.get(id)?.delete(instance);
}

export function getInstances(id: string) {
	return registry.get(id) || new Set<ComponentVdom>();
}
