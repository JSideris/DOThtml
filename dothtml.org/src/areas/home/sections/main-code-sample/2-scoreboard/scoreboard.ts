import { dot } from "dothtml";
import { FrameworkItems, IDotComponent } from "dothtml-interfaces";


let data = [
	{id: 1, name: "Sal", table: 2, rsvpStatus: false},
	{id: 2, name: "Brat", table: 2, rsvpStatus: false},
	{id: 3, name: "Tilly", table: 3, rsvpStatus: false}
];

// Please no cast to any here. Just fix the bug.
const ScoreCard = dot.component<["teamName"], ["updateRsvp"]>(
	class implements IDotComponent{
		_: FrameworkItems;
		build() {

			let scoreBinding = dot.state(0);

			return dot
				.h2(this._.props.teamName)
				.div(scoreBinding)
				.button({
					onClick: ()=>{
						scoreBinding.setValue(scoreBinding.getValue() + 1);
					}
				}, "+1")
		}
	}
);

