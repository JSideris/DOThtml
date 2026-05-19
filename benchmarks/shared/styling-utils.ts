
export function generateStylingData(count: number) {
	const data = [];
	for (let i = 0; i < count; i++) {
		data.push({
			color: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
			scale: 0.5 + Math.random(),
			rotation: Math.floor(Math.random() * 360)
		});
	}
	return data;
}

export class FPSMeter {
	private frames = 0;
	private startTime = 0;
	private isRunning = false;

	start() {
		this.frames = 0;
		this.startTime = performance.now();
		this.isRunning = true;
	}

	tick() {
		if (this.isRunning) {
			this.frames++;
		}
	}

	stop(): number {
		this.isRunning = false;
		const duration = (performance.now() - this.startTime) / 1000;
		return this.frames / duration;
	}
}
