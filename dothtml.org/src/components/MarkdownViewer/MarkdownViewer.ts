import { dot, Priority, DotComponent } from "dothtml";
import MarkdownParser from "../../utils/MarkdownParser";

interface MarkdownViewerProps {
	src: string;
}

@dot.component
export default class MarkdownViewer extends DotComponent<MarkdownViewerProps> {
	static props = {
		src: { type: String, required: true }
	};

	private content = dot.state("");
	private lastSrc = "";

	built() {
		if (this.props.src !== this.lastSrc) {
			this.lastSrc = this.props.src;
			this.load();
		}
	}

	async load() {
		try {
			const response = await fetch(this.props.src);
			if (!response.ok) {
				throw new Error(`Failed to fetch markdown from ${this.props.src}: ${response.statusText}`);
			}
			const markdown = await response.text();
			
			// Use concurrent rendering for parsing and updating content
			const html = MarkdownParser.parse(markdown);
			this.content.setValue(html, Priority.Background);
		} catch (error) {
			console.error("Error loading markdown:", error);
			this.content.setValue(`<p style="color: red;">Error loading documentation: ${error instanceof Error ? error.message : String(error)}</p>`, Priority.Normal);
		}
	}

	stylize(s: any) {
		return s.class("markdown-body", m => m
			.color(s.v("text"))
			.lineHeight(1.7)
		).class("markdown-body h1", h => h
			.fontSizePx(36)
			.marginBottomPx(20)
			.color(s.v("primary"))
		).class("markdown-body h2", h => h
			.fontSizePx(28)
			.marginTopPx(40)
			.marginBottomPx(15)
			.borderBottom("1px solid rgba(255, 255, 255, 0.1)")
			.paddingBottomPx(10)
		).class("markdown-body p", p => p
			.marginBottomPx(15)
		).class("markdown-body ul", l => l
			.paddingLeftPx(25)
			.marginBottomPx(15)
		).class("markdown-body ol", l => l
			.paddingLeftPx(25)
			.marginBottomPx(15)
		).class("markdown-body li", l => l
			.marginBottomPx(5)
		).class("markdown-body pre", p => p
			.backgroundColor("#0d0d0d")
			.paddingPx(20)
			.borderRadiusPx(12)
			.overflow("auto")
			.marginBottomPx(20)
			.border("1px solid rgba(255, 255, 255, 0.05)")
		).class("markdown-body code", c => c
			.fontFamily("'JetBrains Mono', monospace")
			.fontSizePx(14)
		).class("markdown-body table", t => t
			.widthP(100)
			.borderCollapse("collapse")
			.marginBottomPx(20)
			.overflow("hidden")
			.borderRadiusPx(8)
			.border("1px solid rgba(255, 255, 255, 0.1)")
		).class("markdown-body th", t => t
			.backgroundColor("rgba(255, 255, 255, 0.05)")
			.color(s.v("primary"))
			.textAlign("left")
			.paddingPx(12, 15)
			.fontWeight(700)
			.borderBottom("2px solid rgba(255, 255, 255, 0.1)")
		).class("markdown-body td", t => t
			.paddingPx(12, 15)
			.borderBottom("1px solid rgba(255, 255, 255, 0.05)")
		).class("markdown-body tr:last-child td", t => t
			.borderBottom("none")
		).class("markdown-body tr:hover td", t => t
			.backgroundColor("rgba(255, 255, 255, 0.02)")
		);
	}

	build() {
		return dot.div({ class: "markdown-body" }, 
			dot.html(this.content) 
		);
	}
}
