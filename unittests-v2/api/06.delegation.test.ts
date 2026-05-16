
import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import SyntheticEvent from "../../src/events/synthetic-event";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Event delegation.", ()=>{
	test("Basic bubbling.", ()=>{
		let parentHandler = jest.fn();
		let childHandler = jest.fn();

		dot(document.body).div({ id: "parent", onClick: parentHandler } as any,
			dot.button({ id: "child", onClick: childHandler } as any)
		);

		let child = document.getElementById("child");
		child?.click();

		expect(childHandler).toHaveBeenCalled();
		expect(parentHandler).toHaveBeenCalled();
	});

	test("Stop propagation.", ()=>{
		let parentHandler = jest.fn();
		let childHandler = jest.fn((e: SyntheticEvent) => {
			e.stopPropagation();
		});

		dot(document.body).div({ id: "parent", onClick: parentHandler } as any,
			dot.button({ id: "child", onClick: childHandler } as any)
		);

		let child = document.getElementById("child");
		child?.click();

		expect(childHandler).toHaveBeenCalled();
		expect(parentHandler).not.toHaveBeenCalled();
	});

	test("Focus/Blur delegation (non-bubbling).", ()=>{
		let focusHandler = jest.fn();
		let blurHandler = jest.fn();

		dot(document.body).div({ onFocus: focusHandler, onBlur: blurHandler } as any,
			dot.input({ id: "my-input" } as any)
		);

		let input = document.getElementById("my-input") as HTMLInputElement;
		
		input.focus();
		expect(focusHandler).toHaveBeenCalled();

		input.blur();
		expect(blurHandler).toHaveBeenCalled();
	});

	test("Cleanup on unrender.", ()=>{
		let handler = jest.fn();
		let obs = dot.watch(true);

		dot(document.body).when(obs, 
			dot.button({ id: "my-button", onClick: handler } as any)
		);

		let button = document.getElementById("my-button");
		button?.click();
		expect(handler).toHaveBeenCalledTimes(1);

		// Remove the button
		obs.value = false;
		(dot as any).flushSync();
		expect(document.getElementById("my-button")).toBeNull();

		// Simulate a click on where the button was (or just verify it's removed from manager)
		// Since we can't easily inspect the WeakMap, we trust the removeListener call.
		// We can try to manually dispatch an event on a new element with same ID to see if handler persists (it shouldn't).
		
		dot(document.body).button({ id: "my-button" } as any);
		let newButton = document.getElementById("my-button");
		newButton?.click();
		expect(handler).toHaveBeenCalledTimes(1); // Should still be 1
	});

    test("currentTarget vs target.", () => {
        let event: SyntheticEvent | null = null;
        let parent = document.createElement("div");
        
        dot(document.body).div({ id: "parent", onClick: (e) => { event = e; } } as any,
            dot.button({ id: "child" } as any)
        );

        let child = document.getElementById("child");
        let parentEl = document.getElementById("parent");
        child?.click();

        expect(event?.target).toBe(child);
        expect(event?.currentTarget).toBe(parentEl);
    });
});
