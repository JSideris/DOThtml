import { IDotComponent, IDotCore, IDotDocument, IDotWindowWrapper } from "dothtml-interfaces";
import { ContainerVdom } from "./vdom-nodes/container-vdom";
import dot from "./dot";

let documentId = 1;

export default class WindowWrapper implements IDotWindowWrapper{
	window: Window;
	document: Document;
	title: string;
	root: IDotComponent;
	_vdom: ContainerVdom;
	width: number; 
	height: number;
	isOpen = false;
	tether = false;
	syncStyles = false;
	position: "center" | "parent-center" | "beside-parent" | {left: number, top: number} | null = null;

	private static tetheredWindows = new Set<WindowWrapper>();
	private eventListeners: Array<{name: string, callback: (e: any) => void}> = [];

	constructor(options: {content: IDotComponent, width?: number, height?: number, title?: string, tether?: boolean, syncStyles?: boolean, position?: "center" | "parent-center" | "beside-parent" | {left: number, top: number}}){
		this.root = options.content;
		this.width = options.width || options.height || 600;
		this.height = options.height || options.width || 400;
		this.title = options.title || "Window";
		this.tether = options.tether || false;
		this.syncStyles = options.syncStyles || false;
		this.position = options.position || null;
	}

	async open(): Promise<void>{
		if(this.isOpen){
			console.warn("Window is already open.");
			return;
		}

		let left = 0;
		let top = 0;
		let features = `width=${this.width},height=${this.height}`;

		if(this.position){
			if(typeof this.position === "object"){
				left = this.position.left;
				top = this.position.top;
			}
			else if(this.position === "center"){
				left = (window.screen.width - this.width) / 2;
				top = (window.screen.height - this.height) / 2;
			}
			else if(this.position === "parent-center"){
				left = window.screenX + (window.outerWidth - this.width) / 2;
				top = window.screenY + (window.outerHeight - this.height) / 2;
			}
			else if(this.position === "beside-parent"){
				left = window.screenX + window.outerWidth;
				top = window.screenY;
			}
			features += `,left=${left},top=${top}`;
		}

		this.window = window.open("", this.title, features);
		if(!this.window){
			throw new Error("Popup window could not be opened.");
		}

		this.document = this.window.document;
		this.document["_dotId"] = `${documentId++}`;

		let tempElement = document.createElement("div");
		tempElement.textContent = this.title;
		let encodedTitle = tempElement.innerHTML;
		this.document.write(`<!DOCTYPE html><html><head><title>${encodedTitle}</title></head><body></body></html>`);

		if(this.syncStyles){
			this.syncStylesWithParent();
		}

		this._vdom = dot(this.document.body, this.window).mount(this.root) as unknown as ContainerVdom;

		this.isOpen = true;

		if(this.tether){
			WindowWrapper.tetheredWindows.add(this);
			if(WindowWrapper.tetheredWindows.size === 1){
				window.addEventListener("unload", WindowWrapper.closeAllTethered);
			}
		}

		this.window.addEventListener("beforeunload", () => {
			this.isOpen = false;
			if(this.tether){
				WindowWrapper.tetheredWindows.delete(this);
			}
		});

		// Attach event listeners
		for(const {name, callback} of this.eventListeners){
			this.document.addEventListener(name, callback);
		}
	}

	on(event: string, callback: (e: any) => void): this {
		this.eventListeners.push({name: event, callback});
		if(this.document){
			this.document.addEventListener(event, callback);
		}
		return this;
	}

	focus(): void {
		if(this.window) this.window.focus();
	}

	bringToFront(): void {
		if(this.window) this.window.focus();
	}

	resizeTo(width: number, height: number): void {
		if(this.window) this.window.resizeTo(width, height);
		this.width = width;
		this.height = height;
	}

	moveTo(left: number, top: number): void {
		if(this.window) this.window.moveTo(left, top);
	}

	private static closeAllTethered = () => {
		WindowWrapper.tetheredWindows.forEach(w => w.close());
		WindowWrapper.tetheredWindows.clear();
	}

	private syncStylesWithParent(){
		// 1. Copy body class
		this.document.body.className = document.body.className;

		// 2. Copy CSS variables from :root
		const rootStyles = getComputedStyle(document.documentElement);
		for(let i = 0; i < document.documentElement.style.length; i++){
			const prop = document.documentElement.style[i];
			if(prop.startsWith("--")){
				this.document.documentElement.style.setProperty(prop, rootStyles.getPropertyValue(prop));
			}
		}
		// Also check for properties set directly on the style object that might not be in the enumeration
		// (though usually they are if they are set via setProperty)

		// 3. Copy adoptedStyleSheets
		if(this.document.adoptedStyleSheets && document.adoptedStyleSheets){
			this.document.adoptedStyleSheets = [...document.adoptedStyleSheets];
		}

		// 4. Copy <style> and <link> tags
		const styles = document.head.querySelectorAll("style, link[rel='stylesheet']");
		styles.forEach(style => {
			this.document.head.appendChild(style.cloneNode(true));
		});
	}

	close(): void {
		if(this.window){
			if(this._vdom){
				this._vdom._unrender();
				this._vdom = null;
			}

			this.window.close();
			this.window = null;
			this.document = null;
			this.isOpen = false;

			if(this.tether){
				WindowWrapper.tetheredWindows.delete(this);
			}
		}
	}
}
