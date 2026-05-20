import { dot } from "dothtml";
import { ProfilingBenchmark } from "./profiling-benchmark";

export type ProfileTestId =
	| "create-1000"
	| "create-10000"
	| "append-1000"
	| "update-every-10th"
	| "swap-rows"
	| "clear";

export const PROFILE_TESTS: { id: ProfileTestId; label: string }[] = [
	{ id: "create-1000", label: "Create 1,000 rows" },
	{ id: "create-10000", label: "Create 10,000 rows" },
	{ id: "append-1000", label: "Append 1,000 rows" },
	{ id: "update-every-10th", label: "Update every 10th row" },
	{ id: "swap-rows", label: "Swap Rows" },
	{ id: "clear", label: "Clear" }
];

export interface ProfileBurstResult {
	testName: string;
	elapsedMs: number;
}

function flush() {
	(dot as any).flushSync();
}

function runOnce(
	benchmark: ProfilingBenchmark,
	testName: string,
	markName: string,
	setup: () => void,
	run: () => void
): ProfileBurstResult {
	setup();
	flush();

	const markLabel = `profile-${markName}`;
	performance.mark(`${markLabel}-start`);

	const start = performance.now();
	run();
	flush();

	const elapsedMs = performance.now() - start;

	performance.mark(`${markLabel}-end`);
	performance.measure(markLabel, `${markLabel}-start`, `${markLabel}-end`);

	return { testName, elapsedMs };
}

export function runProfileBurst(
	benchmark: ProfilingBenchmark,
	testId: ProfileTestId
): ProfileBurstResult {
	const test = PROFILE_TESTS.find(t => t.id === testId)!;

	switch (testId) {
		case "create-1000":
			return runOnce(benchmark, test.label, testId,
				() => benchmark.clear(),
				() => benchmark.create1000()
			);

		case "create-10000":
			return runOnce(benchmark, test.label, testId,
				() => benchmark.clear(),
				() => benchmark.create10000()
			);

		case "append-1000":
			return runOnce(benchmark, test.label, testId,
				() => {
					benchmark.clear();
					benchmark.create1000();
				},
				() => benchmark.append1000()
			);

		case "update-every-10th":
			return runOnce(benchmark, test.label, testId,
				() => {
					benchmark.clear();
					benchmark.create1000();
				},
				() => benchmark.updateEvery10th()
			);

		case "swap-rows":
			return runOnce(benchmark, test.label, testId,
				() => {
					benchmark.clear();
					benchmark.create1000();
				},
				() => benchmark.swapRows()
			);

		case "clear":
			return runOnce(benchmark, test.label, testId,
				() => benchmark.create1000(),
				() => benchmark.clear()
			);
	}
}
