import { IWatcher } from "./i-watcher";
import { DotContent } from "../i-dot";

export interface IRef<T = any> extends IWatcher<T | null> {
	get element(): T;
	ready(): Promise<T>;
	append(content: DotContent): this;
	prepend(content: DotContent): this;
}
