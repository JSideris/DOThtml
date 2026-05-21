import type { ComponentVdom } from "./component-vdom";

export const componentStack: ComponentVdom[] = [];
export const getCurrentComponent = () => componentStack[componentStack.length - 1] || null;
export const pushComponent = (component: ComponentVdom) => componentStack.push(component);
export const popComponent = () => componentStack.pop();
