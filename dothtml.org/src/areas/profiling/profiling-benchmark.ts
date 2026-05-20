import { dot, DotComponent } from "dothtml";
import { buildData } from "./data-generator";

export type BenchmarkRow = { id: number; label: string };

@dot.component
export class ProfilingBenchmark extends DotComponent {
	data = dot.state<BenchmarkRow[]>([], "id");
	selected = dot.state<number | null>(null);

	clear() {
		this.data.value = [];
		this.selected.value = null;
	}

	create1000() {
		this.data.value = buildData(1000);
		this.selected.value = null;
	}

	create10000() {
		this.data.value = buildData(10000);
		this.selected.value = null;
	}

	append1000() {
		this.data.value = [...this.data.value, ...buildData(1000)];
	}

	updateEvery10th() {
		const d = this.data.value;
		for (let i = 0; i < d.length; i += 10) {
			d[i].label += " !!!";
		}
		this.data.value = [...d];
	}

	swapRows() {
		const d = this.data.value;
		if (d.length > 998) {
			const temp = d[1];
			d[1] = d[998];
			d[998] = temp;
			this.data.value = [...d];
		}
	}

	select(id: number) {
		this.selected.value = id;
	}

	remove(id: number) {
		this.data.value = this.data.value.filter(d => d.id !== id);
	}

	stylize(s: any) {
		return s.class("profiling-benchmark", b => b
			.widthP(100)
		).class("benchmark-table", t => t
			.widthP(100)
			.borderCollapse("collapse")
			.color(s.v("text"))
		).class("benchmark-table td", td => td
			.paddingPx(8, 12)
			.borderTop("1px solid rgba(255, 255, 255, 0.08)")
			.verticalAlign("top")
		).class("benchmark-table tr.selected", tr => tr
			.backgroundColor("rgba(255, 152, 0, 0.12)")
		).class("benchmark-table a", a => a
			.color(s.v("primary"))
			.cursor("pointer")
		).class("danger", d => d
			.color("#f87171")
		);
	}

	build() {
		return dot.div({ class: "profiling-benchmark" },
			dot.table({ class: "benchmark-table" },
				dot.tBody(
					dot.each(this.data, d =>
						dot.tr({ class: this.selected.bindAs(s => s === d.id ? "selected" : "") },
							dot.td(d.id),
							dot.td(
								dot.a({ onClick: () => this.select(d.id) }, d.label)
							),
							dot.td(
								dot.a({ onClick: () => this.remove(d.id) },
									dot.span({ class: "danger" }, "x")
								)
							),
							dot.td()
						)
					)
				)
			)
		);
	}
}
