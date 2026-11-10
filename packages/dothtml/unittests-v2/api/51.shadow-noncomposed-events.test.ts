import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

afterEach(() => {
	const root = document.body[DOT_VDOM_PROP_NAME];
	if (root && root.children) {
		root.children._unrender();
	}
	document.body.innerHTML = "";
	document.body[DOT_VDOM_PROP_NAME] = null;
});

class CheckboxForm {
	public checked = false;
	public submitted = false;
	public toggled = false;
	build() {
		return (dot as any)
			.form({
				id: "inner-form",
				onSubmit: (e: any) => {
					e.preventDefault();
					this.submitted = true;
				},
			},
				(dot as any).input({
					id: "inner-box",
					type: "checkbox",
					onChange: () => { this.checked = true; },
				}),
				(dot as any).details({
					id: "inner-details",
					onToggle: () => { this.toggled = true; },
				}, (dot as any).summary("More"))
			);
	}
}

describe("Non-composed events inside components.", () => {
	test("onChange on a checkbox inside a component fires.", () => {
		const component = new CheckboxForm();
		(dot(document.body) as any).mount(component);

		const host = document.body.children[0] as HTMLElement;
		const box = host.shadowRoot.getElementById("inner-box") as HTMLInputElement;
		expect(box).toBeTruthy();

		box.checked = true;
		box.dispatchEvent(new Event("change", { bubbles: true, composed: false }));

		expect(component.checked).toBe(true);
	});

	test("onSubmit inside a component fires.", () => {
		const component = new CheckboxForm();
		(dot(document.body) as any).mount(component);

		const host = document.body.children[0] as HTMLElement;
		const form = host.shadowRoot.getElementById("inner-form") as HTMLFormElement;
		form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true, composed: false }));

		expect(component.submitted).toBe(true);
	});

	test("onToggle on details inside a component fires.", () => {
		const component = new CheckboxForm();
		(dot(document.body) as any).mount(component);

		const host = document.body.children[0] as HTMLElement;
		const details = host.shadowRoot.getElementById("inner-details") as HTMLDetailsElement;
		details.dispatchEvent(new Event("toggle", { bubbles: false, composed: false }));

		expect(component.toggled).toBe(true);
	});

	test("onChange still works in the light DOM.", () => {
		let changed = false;
		dot(document.body).input({
			id: "light-box",
			type: "checkbox",
			onChange: () => { changed = true; },
		} as any);

		const box = document.getElementById("light-box") as HTMLInputElement;
		box.checked = true;
		box.dispatchEvent(new Event("change", { bubbles: true, composed: false }));
		expect(changed).toBe(true);
	});
});
