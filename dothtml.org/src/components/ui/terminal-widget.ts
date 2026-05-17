import { dot, DotComponent } from "dothtml";

interface TerminalProps {
	command: string;
}

@dot.component
export default class TerminalWidget extends DotComponent<TerminalProps> {
	static props = {
		command: { type: String, default: "npm install dothtml" }
	};

	private copied = dot.state(false);

	copy() {
		navigator.clipboard.writeText(this.props.command);
		this.copied.value = true;
		setTimeout(() => this.copied.value = false, 2000);
	}

	stylize(s: any) {
		return s.class("terminal", t => t
			.backgroundColor("#0d0d0d")
			.borderRadiusPx(12)
			.paddingPx(20)
			.fontFamily("'JetBrains Mono', monospace")
			.position("relative")
			.border("1px solid rgba(255, 255, 255, 0.1)")
			.boxShadow("0 10px 30px rgba(0, 0, 0, 0.5)")
			.display("flex")
			.alignItems("center")
			.cursor("pointer")
		).class("prompt", p => p
			.color(s.v("primary"))
			.marginRightPx(10)
			.userSelect("none")
		).class("command", c => c
			.color("#fff")
			.flex(1)
			.whiteSpace("nowrap")
			.overflow("hidden")
			.textOverflow("ellipsis")
		).class("copy-hint", ch => ch
			.position("absolute")
			.topPx(8)
			.rightPx(12)
			.fontSizePx(10)
			.color(s.v("text-dim"))
			.opacity(0.5)
		).media("screen and (max-width: 600px)", m => m
			.class("terminal", t => t
				.paddingPx(15)
			)
		);
	}

	build() {
		return dot.div({ class: "terminal", onClick: () => this.copy() },
			dot.span({ class: "prompt" }, "$"),
			dot.span({ class: "command" }, this.props.command),
			dot.span({ class: "copy-hint" }, this.copied.bindAs(c => c ? "Copied!" : "Click to copy"))
		);
	}
}
