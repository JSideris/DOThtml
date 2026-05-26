
import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import SyntheticEvent from "../../src/events/synthetic-event";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

class InputComponent {
    build(dot: any) {
        return dot.input({ id: "inner-input", type: "text" });
    }
}

class NestedComponent {
    build(dot: any) {
        return dot.div(
            dot.mount(new InputComponent())
        );
    }
}

describe("Event retargeting bug.", () => {
    test("Basic retargeting: target should be the inner input, not the host.", () => {
        let receivedTarget: any = null;
        const component = new InputComponent();

        dot(document.body).mount(component, { 
            onInput: (e: any) => { receivedTarget = e.target; } 
        });
        
        let shadowEl = document.body.children[0] as HTMLElement;
        let input = shadowEl.shadowRoot.getElementById("inner-input") as HTMLInputElement;
        
        // Simulate input event
        input.value = "test";
        input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
        
        expect(receivedTarget).toBe(input);
    });

    test("Nested components: target should be the deepest element.", () => {
        let receivedTarget: any = null;
        const component = new NestedComponent();

        dot(document.body).mount(component, { 
            onInput: (e: any) => { receivedTarget = e.target; } 
        });
        
        let outerShadowEl = document.body.children[0] as HTMLElement;
        let innerShadowEl = outerShadowEl.shadowRoot.querySelector("dothtml-input-component") as HTMLElement; // Tag name might vary, but let's assume it's findable
        if(!innerShadowEl) {
            // Fallback if tag name is random
            innerShadowEl = outerShadowEl.shadowRoot.querySelector("[cvdom]") as HTMLElement;
        }
        let input = innerShadowEl.shadowRoot.getElementById("inner-input") as HTMLInputElement;
        
        input.value = "test";
        input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
        
        expect(receivedTarget).toBe(input);
    });

    test("External listeners: should see the original target.", () => {
        let receivedTarget: any = null;
        const component = new InputComponent();

        dot(document.body).div({ onInput: (e: any) => { receivedTarget = e.target; } } as any,
            dot.mount(component)
        );
        
        let shadowEl = document.querySelector("div").children[0] as HTMLElement;
        let input = shadowEl.shadowRoot.getElementById("inner-input") as HTMLInputElement;
        
        input.value = "test";
        input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
        
        expect(receivedTarget).toBe(input);
    });

    test(".self modifier with retargeted events.", () => {
        let hostHandler = jest.fn();
        const component = new InputComponent();

        dot(document.body).mount(component, { 
            "onInput.self": hostHandler 
        });
        
        let shadowEl = document.body.children[0] as HTMLElement;
        let input = shadowEl.shadowRoot.getElementById("inner-input") as HTMLInputElement;
        
        input.value = "test";
        input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
        
        // Should NOT be called because the target is the input, not the host
        expect(hostHandler).not.toHaveBeenCalled();

        // Should be called if we dispatch directly on the host
        shadowEl.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
        expect(hostHandler).toHaveBeenCalledTimes(1);
    });
});
