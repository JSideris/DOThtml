import { IDotComponent, IDotCore, IDotDocument, IDotWindowWrapper } from "dothtml-interfaces";
import { ContainerVdom } from "./vdom-nodes/container-vdom";
import dot from "./dot";
import { DOT_VDOM_PROP_NAME } from "./constants";

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
	private wrapperEventListeners: Array<{name: string, callback: (e: any) => void}> = [];

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

		this.setupDocument();

		this.isOpen = true;

		if(this.tether){
			WindowWrapper.tetheredWindows.add(this);
			if(WindowWrapper.tetheredWindows.size === 1){
				window.addEventListener("pagehide", WindowWrapper.closeAllTethered);
				window.addEventListener("beforeunload", WindowWrapper.closeAllTethered);
				window.addEventListener("unload", WindowWrapper.closeAllTethered);
			}
		}
	}

	private setupDocument(){
		if(this._vdom){
			this._vdom._unrender();
			this._vdom = null;
		}

		this.document = this.window.document;
		this.document["_dotId"] = `${documentId++}`;

		let tempElement = document.createElement("div");
		tempElement.textContent = this.title;
		let encodedTitle = tempElement.innerHTML;
		
		if (this.document.open) {
			this.document.open();
			this.document.write(`<!DOCTYPE html><html><head><title>${encodedTitle}</title></head><body></body></html>`);
			this.document.close();
		} else {
			// Fallback for environments like JSDOM where document.open might be missing or limited
			this.document.documentElement.innerHTML = `<head><title>${encodedTitle}</title></head><body></body>`;
		}

		// Re-acquire the document and body as document.write can replace the document object
		this.document = this.window.document;
		const body = this.document.body;
		body.innerHTML = "";
		delete body[DOT_VDOM_PROP_NAME];

		if(this.syncStyles){
			this.syncStylesWithParent();
		}

		this._vdom = dot(body, this.window).mount(this.root) as unknown as ContainerVdom;

		// Attach event listeners
		for(const {name, callback} of this.eventListeners){
			this.document.addEventListener(name, callback);
		}

		this.window.addEventListener("unload", () => {
			if (this.isOpen) {
				setTimeout(() => {
					if (this.window && !this.window.closed) {
						this.setupDocument();
					} else {
						this.isOpen = false;
						if (this.tether) {
							WindowWrapper.tetheredWindows.delete(this);
						}
						this.emit("close");
					}
				}, 100);
			}
		});
	}

	on(event: string, callback: (e: any) => void): this {
		if (event === "close") {
			this.wrapperEventListeners.push({ name: event, callback });
		} else {
			this.eventListeners.push({ name: event, callback });
			if (this.document) {
				this.document.addEventListener(event, callback);
			}
		}
		return this;
	}

	private emit(event: string, detail?: any) {
		for (const { name, callback } of this.wrapperEventListeners) {
			if (name === event) {
				callback(detail);
			}
		}
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
			const clonedSheets = [];
			for(const sheet of document.adoptedStyleSheets){
				try{
					const newSheet = new (this.window as any).CSSStyleSheet();
					let cssText = "";
					for(let i = 0; i < sheet.cssRules.length; i++){
						cssText += sheet.cssRules[i].cssText + "\n";
					}
					newSheet.replaceSync(cssText);
					clonedSheets.push(newSheet);
				}
				catch(e){
					console.warn("Failed to clone adopted stylesheet:", e);
				}
			}
			this.document.adoptedStyleSheets = clonedSheets;
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

			this.emit("close");
		}
	}
}
