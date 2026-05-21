import { IWatcher } from "./i-watcher";

export interface IRef<T = any> extends IWatcher<T | null> {
	get element(): T;
}
