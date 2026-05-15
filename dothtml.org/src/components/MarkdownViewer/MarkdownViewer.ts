import { dot } from "dothtml";
import { IDotComponent, FrameworkItems } from "dothtml-interfaces";
import MarkdownParser from "../../utils/MarkdownParser";

class MarkdownViewer implements IDotComponent {
	_?: FrameworkItems;
	private content = dot.state(""); // Reactive state for parsed HTML

	constructor(private src: string) {
		this.load();
	}

	async load() {
		try {
			const response = await fetch(this.src);
			if (!response.ok) {
				throw new Error(`Failed to fetch markdown from ${this.src}: ${response.statusText}`);
			}
			const markdown = await response.text();
			this.content.value = MarkdownParser.parse(markdown);
		} catch (error) {
			console.error("Error loading markdown:", error);
			this.content.value = `<p style="color: red;">Error loading documentation: ${error instanceof Error ? error.message : String(error)}</p>`;
		}
	}

	build() {
		// Render the parsed HTML reactively
		return dot.div({ class: "markdown-body" }, 
			dot.h(this.content) 
		);
	}
}

export default MarkdownViewer;
