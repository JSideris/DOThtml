import { IComponent, IDotDocument, IDotWindowWrapper } from "dothtml-interfaces";
import { ContainerVdom } from "./vdom-nodes/container-vdom";
import dot from "./dot";

export default class WindowWrapper implements IDotWindowWrapper{
	window: Window;
	document: Document;
	title: string;
	root: IComponent;
	_vdom: ContainerVdom;
	width: number; 
	height: number;
	isOpen = false;

	constructor(options: {content: IComponent, width?: number, height?: number, title?: string}){
		this.root = options.content;
		this.width = options.width || options.height || 600;
		this.height = options.height || options.width || 400;
		this.title = options.title || "Window";

	}

	open(){
		if(this.isOpen){
			console.warn("Window is already open.");
			return;
		}

		this.window = window.open("", this.title, `width=${this.width},height=${this.height}`);
		this.document = this.window.document;
		this.document.write(`<!DOCTYPE html><html><head><title>${this.title}</title></head><body></body></html>`);

		this._vdom = dot(this.document.body).mount(this.root) as unknown as ContainerVdom;

		if(this.window){
			this.isOpen = true;
		}
	}

	close(): void {
		if(this.window){
			this._vdom._unrender();
			this._vdom = null;

			this.window.close();
			this.window = null;
			this.document = null;
			this.isOpen = false;
		}
	}
}