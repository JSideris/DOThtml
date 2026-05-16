import dot from "./dot";
import { currentPath, navigate } from "./routing";
import { IDotComponent } from "dothtml-interfaces";
import { getGlobalRoutes } from "./router";
import { generatePath } from "./routing-helpers";

export const Link = dot.component(
	class implements IDotComponent {
		static props = {
			to: { type: String, default: "" },
			name: { type: String, default: "" },
			params: { type: Object, default: () => ({}) },
			activeClass: { type: String, default: "active" },
			exact: { type: Boolean, default: false },
			label: { type: String, default: "" }
		};

		props: any;
		slots: any;

		private getResolvedPath() {
			if (this.props.name) {
				return generatePath(getGlobalRoutes(), this.props.name, this.props.params) || "";
			}
			return this.props.to;
		}

		build() {
			const resolvedPath = dot.computed(() => this.getResolvedPath());

			return dot.a({
				href: resolvedPath,
				class: dot.computed(() => {
					const path = currentPath.value;
					const target = resolvedPath.value;
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
						navigate(resolvedPath.value);
					}
				}
			}, this.props.label || this.slots?.default);
		}
	}
);
