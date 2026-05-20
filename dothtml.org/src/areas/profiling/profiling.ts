import { dot, DotComponent } from "dothtml";
import { ProfilingBenchmark } from "./profiling-benchmark";
import {
	PROFILE_TESTS,
	ProfileTestId,
	runProfileBurst
} from "./profiling-runner";

@dot.component
export default class Profiling extends DotComponent {
	private benchmark = new ProfilingBenchmark();
	private running = dot.state(false);
	private status = dot.state("Ready. Open DevTools → Performance, start recording, then run a test.");

	stylize(s: any) {
		return s.class("profiling-page", p => p
			.minHeight("100vh")
			.paddingPx(90, 24, 40, 24)
			.maxWidthPx(1200)
			.margin("0 auto")
			.position("relative")
			.zIndex(1)
		).class("profiling-panel", pan => pan
			.backgroundColor("rgba(255, 255, 255, 0.02)")
			.border("1px solid rgba(255, 255, 255, 0.06)")
			.borderRadiusPx(12)
			.paddingPx(24)
			.marginBottomPx(24)
		).class("profiling-panel h1", h => h
			.fontSizePx(28)
			.fontWeight(800)
			.color(s.v("primary"))
			.marginBottomPx(8)
		).class("profiling-panel h2", h => h
			.fontSizePx(16)
			.fontWeight(600)
			.color(s.v("text"))
			.marginBottomPx(12)
		).class("instructions", i => i
			.color(s.v("text-dim"))
			.fontSizePx(14)
			.lineHeight(1.7)
			.marginBottomPx(16)
		).class("instructions ol", o => o
			.paddingLeftPx(20)
		).class("instructions li", li => li
			.marginBottomPx(6)
		).class("status", st => st
			.fontFamily("'JetBrains Mono', monospace")
			.fontSizePx(13)
			.color(s.v("text"))
			.paddingPx(12, 16)
			.backgroundColor("rgba(0, 0, 0, 0.25)")
			.borderRadiusPx(8)
			.marginBottomPx(16)
		).class("button-row", r => r
			.display("flex")
			.flexWrap("wrap")
			.gapPx(8)
		).class("profile-btn", b => b
			.paddingPx(10, 16)
			.border("1px solid rgba(255, 152, 0, 0.35)")
			.borderRadiusPx(8)
			.backgroundColor("rgba(255, 152, 0, 0.08)")
			.color(s.v("primary"))
			.fontWeight(600)
			.fontSizePx(13)
			.cursor("pointer")
			.transition("all 0.15s")
		).class("profile-btn:hover", b => b
			.backgroundColor("rgba(255, 152, 0, 0.18)")
		).class("profile-btn:disabled", b => b
			.opacity(0.45)
			.cursor("not-allowed")
		).class("table-container", tc => tc
			.maxHeightPx(480)
			.overflowY("auto")
			.border("1px solid rgba(255, 255, 255, 0.06)")
			.borderRadiusPx(12)
			.paddingPx(8)
		).class("duration-note", n => n
			.fontSizePx(12)
			.color(s.v("text-dim"))
			.marginTopPx(12)
		);
	}

	private runTest(testId: ProfileTestId) {
		if (this.running.value) return;

		this.running.value = true;
		this.status.value = `Running ${testId}…`;

		dot.setSync(true);
		try {
			const result = runProfileBurst(this.benchmark, testId);
			this.status.value = `${result.testName}: ${result.elapsedMs.toFixed(1)}ms`;
		} catch (err) {
			this.status.value = `Error: ${(err as Error).message}`;
		} finally {
			dot.setSync(false);
			this.running.value = false;
		}
	}

	build() {
		return dot.div({ class: "profiling-page" },
			dot.div({ class: "profiling-panel" },
				dot.h1("DOThtml Profiling"),
				dot.h2("DevTools Performance"),
				dot.div({ class: "instructions" },
					dot.ol(
						dot.li("Open Chrome DevTools → Performance tab."),
						dot.li("Click Record (circle button)."),
						dot.li("Click a test button below — each runs the test once (synchronous)."),
						dot.li("Stop recording. In the flame chart, search for updateList, _render, or batchRenderNewItems."),
						dot.li("Check the Timings track for profile-* user timing measures.")
					)
				),
				dot.div({ class: "status" }, this.status),
				dot.div({ class: "button-row" },
					dot.each(PROFILE_TESTS, test =>
						dot.button({
							class: "profile-btn",
							disabled: this.running.bindAs(r => r ? true : null),
							onClick: () => this.runTest(test.id)
						}, test.label)
					)
				),
				dot.p({ class: "duration-note" },
					"Append pre-populates 1,000 rows, then appends 1,000 more (matches Playwright setup). dot.setSync enabled during each run."
				)
			),
			dot.div({ class: "table-container" },
				dot.mount(this.benchmark)
			)
		);
	}
}
