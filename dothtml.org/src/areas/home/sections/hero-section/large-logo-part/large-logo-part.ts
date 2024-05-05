import { dot } from "dothtml";
import { FrameworkItems, IDotComponent, IReactive } from "dothtml-interfaces";
import styles from "./large-logo-part.css";

type Orbiter = {
	x: IReactive<number>
	y: IReactive<number>
	z: IReactive<number>
};

// @dot.component.useStyles(styles)
const LargeLogoPart = dot.component(
	class implements IDotComponent{
		_?: FrameworkItems;
		orbiter1: Orbiter = {
			x: dot.watch(0),
			y: dot.watch(0),
			z: dot.watch(0),
		};
		orbiter2: Orbiter = {
			x: dot.watch(0),
			y: dot.watch(0),
			z: dot.watch(0),
		};

		mounted(): void {
			console.log("READY");
			this.animate();
		}

		animate(){
			requestAnimationFrame(()=>this.animate());
			let t = Date.now();
			this.calculateOrbitPosition(160, 0.2, 1300, t, this.orbiter1);
			this.calculateOrbitPosition(160, 0.3, 1400, t, this.orbiter2);
		}

		calculateOrbitPosition(a: number, e: number, T: number, t: number, out: Orbiter) {
			// Mean motion
			let n = 2 * Math.PI / T;
		
			// Mean anomaly
			let M = n * t;
		
			// Solve Kepler's equation for Eccentric Anomaly (E)
			let E = M; // Initial approximation
			for (let i = 0; i < 10; i++) { // Iterate to solve
				E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
			}
		
			// True anomaly
			let trueAnomaly = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
		
			// Distance from focus
			let r = a * (1 - e * e) / (1 + e * Math.cos(trueAnomaly));
		
			// Convert to Cartesian coordinates
			let x = r * Math.cos(trueAnomaly);
			let y = r * Math.sin(trueAnomaly);

			// console.log(trueAnomaly);
		
			out.x.setValue(x);
			out.y.setValue(y);
			out.z.setValue(y > 0 ? 0 : 3);
		}

		build() {
			return dot.div( {id: "container"},
				dot.div(
					{
						id: "logo"
					},
					dot.span(
						{
							id: "dot"
						},
						dot
						.div({id: "dot-text"}, "DOT")

						.div({
							id: "orbiter1", 
							class: "orbiter",
							style: {
								zIndex:	this.orbiter1.z,
								transform: 
									[{
										rotateX: 60,
										rotateY: 60,
									},
									{
										translateX: this.orbiter1.x,
										translateY: this.orbiter1.y,
									},
									{
										rotateY: -60,
										rotateX: -60,
									}]

							}
						}, 
						"*")

						.div({
							id: "orbiter2",
							class: "orbiter",
							style: {
								zIndex: this.orbiter2.z,
								transform: [
									{
										rotateX: -60,
										rotateY: 50,
									},
									{
										translateX: this.orbiter2.x,
										translateY: this.orbiter2.y,
									},
									{
										rotateY: -50,
										rotateX: 60
									}
								]
							}

						}, "*")
					)
					.span({id: "html"}, "html")
				)
				// .div().id("orbiter1").class("orbiter").style(dot.css.transform(tb => tb.translate(this.orbiter1.x as any, this.orbiter1.y as any)))
				// .div().id("orbiter1").class("orbiter").style(dot.css.transform(tb => tb.translate3d(`1px`,`1px`,`0px`)))
				.div({id: "tagline"}, "Redefine web development.")
			);
		}
	}, [styles]
);

export default LargeLogoPart;