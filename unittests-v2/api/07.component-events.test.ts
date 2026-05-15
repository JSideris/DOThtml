
import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import SyntheticEvent from "../../src/events/synthetic-event";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

class EmitComponent {
    public emit: (name: string, detail?: any) => void;
    build(dot: any) {
        return dot.button({ id: "emit-button", onClick: () => this.emit("customEvent", { foo: "bar" }) }, "Emit");
    }
}

describe("Component events.", ()=>{
	test("Component emitting and parent listening via mount.", ()=>{
		let receivedDetail: any = null;
        const component = new EmitComponent();

		(dot(document.body) as any).mount(component, { 
            onCustomEvent: (e: any) => { receivedDetail = e.detail; } 
        });
		
		let shadowEl = document.body.children[0] as HTMLElement;
		let button = shadowEl.shadowRoot.getElementById("emit-button");
		button?.click();
		
		expect(receivedDetail).toEqual({ foo: "bar" });
	});

    test("Component emitting and parent listening via fluent .on().", ()=>{
		let receivedDetail: any = null;
        const component = new EmitComponent();

		(dot(document.body).mount(component) as any).on("customEvent", (e: any) => { 
            receivedDetail = e.detail; 
        });
		
		let shadowEl = document.body.children[0] as HTMLElement;
		let button = shadowEl.shadowRoot.getElementById("emit-button");
		button?.click();
		
		expect(receivedDetail).toEqual({ foo: "bar" });
	});

    test("Event bubbling from component.", ()=>{
        let parentReceived = false;
        const component = new EmitComponent();

        dot(document.body).div({ onClick: () => { parentReceived = true; } } as any,
            dot.mount(component)
        );

        let shadowEl = document.querySelector("div").children[0] as HTMLElement;
        let button = shadowEl.shadowRoot.getElementById("emit-button");
        button?.click();

        expect(parentReceived).toBe(true);
    });

    test("Custom event bubbling.", ()=>{
        let parentReceived = false;
        const component = new EmitComponent();

        dot(document.body).div({ onCustomEvent: () => { parentReceived = true; } } as any,
            dot.mount(component)
        );

        let shadowEl = document.querySelector("div").children[0] as HTMLElement;
        let button = shadowEl.shadowRoot.getElementById("emit-button");
        button?.click();

        expect(parentReceived).toBe(true);
    });
});
