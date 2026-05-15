import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";
import SyntheticEvent from "../../src/events/synthetic-event";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("Event system.", ()=>{
	test("Synthetic event properties.", ()=>{
		let event: SyntheticEvent | null = null;
		dot(document.body).button({ 
			id: "my-button", 
			onClick: (e: any) => { event = e; } 
		} as any);
		
		let button = document.getElementById("my-button");
		button?.click();
		
		expect(event).toBeInstanceOf(SyntheticEvent);
		expect(event?.type).toBe("click");
		expect(event?.target).toBe(button);
		expect(event?.nativeEvent).toBeInstanceOf(Event);
	});

	test(".stop modifier.", ()=>{
		let parentHandler = jest.fn();
		let childHandler = jest.fn();

		dot(document.body).div({ onClick: parentHandler } as any,
			dot.button({ id: "my-button", "onClick.stop": childHandler } as any)
		);

		let button = document.getElementById("my-button");
		button?.click();

		expect(childHandler).toHaveBeenCalled();
		expect(parentHandler).not.toHaveBeenCalled();
	});

	test(".prevent modifier.", ()=>{
		let handler = jest.fn((e: SyntheticEvent) => {
			expect(e.defaultPrevented).toBe(true);
		});

		dot(document.body).a({ id: "my-link", hRef: "#", "onClick.prevent": handler } as any);

		let link = document.getElementById("my-link");
		link?.dispatchEvent(new MouseEvent("click", { cancelable: true }));

		expect(handler).toHaveBeenCalled();
	});

	test(".once modifier.", ()=>{
		let handler = jest.fn();

		dot(document.body).button({ id: "my-button", "onClick.once": handler } as any);

		let button = document.getElementById("my-button");
		button?.click();
		button?.click();

		expect(handler).toHaveBeenCalledTimes(1);
	});

	test(".self modifier.", ()=>{
		let handler = jest.fn();

		dot(document.body).div({ id: "my-div", "onClick.self": handler } as any,
			dot.button({ id: "my-button" } as any)
		);

		let div = document.getElementById("my-div");
		let button = document.getElementById("my-button");

		button?.click(); // Should bubble but be ignored by .self
		expect(handler).not.toHaveBeenCalled();

		div?.click(); // Should trigger
		expect(handler).toHaveBeenCalledTimes(1);
	});

	test("Multiple modifiers.", ()=>{
		let parentHandler = jest.fn();
		let childHandler = jest.fn((e: SyntheticEvent) => {
			expect(e.defaultPrevented).toBe(true);
		});

		dot(document.body).div({ onClick: parentHandler } as any,
			dot.button({ id: "my-button", "onClick.stop.prevent": childHandler } as any)
		);

		let button = document.getElementById("my-button");
		button?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

		expect(childHandler).toHaveBeenCalled();
		expect(parentHandler).not.toHaveBeenCalled();
	});
});
