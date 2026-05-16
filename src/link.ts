import dot from "./dot";
import { currentPath, navigate } from "./routing";
import { IDotComponent } from "dothtml-interfaces";

export const Link = dot.component(
	class implements IDotComponent {
		static props = {
			to: { type: String, required: true },
			activeClass: { type: String, default: "active" },
			exact: { type: Boolean, default: false },
			label: { type: String, default: "" }
		};

		props: any;
		slots: any;

		build() {
			return dot.a({
				href: this.props.to,
				class: dot.computed(() => {
					const path = currentPath.value;
					const target = this.props.to;
					const isActive = this.props.exact 
						? path === target 
						: path.startsWith(target);
					
					return isActive ? this.props.activeClass : "";
				}),
				onClick: (e: MouseEvent) => {
					// Only handle left clicks without modifier keys.
					if (
						e.button === 0 &&
						!e.ctrlKey &&
						!e.shiftKey &&
						!e.altKey &&
						!e.metaKey
					) {
						e.preventDefault();
						navigate(this.props.to);
					}
				}
			}, this.props.label || this.slots?.default);
		}
	}
);
