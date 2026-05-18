import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

afterEach(() => { 
	const root = document.body[DOT_VDOM_PROP_NAME];
	if (root && root.children) {
		root.children._unrender();
	}
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("DOM events.", ()=>{
	test("Button click.", ()=>{
		let mockClickHandler = jest.fn();

		dot(document.body).button({ id: "my-button", onClick: mockClickHandler });
		let button = document.getElementById("my-button");
		button?.click();
		
		expect(mockClickHandler).toHaveBeenCalled();
	});

	test("Change input.", ()=>{
		const mockFocusHandler = jest.fn();
		const mockBlurHandler = jest.fn();
		// Note: changes only happen after user interaction, so this part isn't properly tested here. 
		// Only way to test is to manually dispatch the change event.
		const mockChangeHandler = jest.fn();

		dot(document.body).input({ 
			id: "my-input", 
			onFocus: mockFocusHandler, 
			onBlur: mockBlurHandler, 
			onChange: mockChangeHandler 
		});
		let inputElement = document.getElementById("my-input") as HTMLInputElement;
		
		// Mock functions to simulate focus and blur event handlers
	
		// Simulate focusing on the input
		inputElement!.focus();
		expect(mockFocusHandler).toHaveBeenCalled();
		expect(document.activeElement).toBe(inputElement);
	
		// Simulate typing into the input
		const text = 'Hello, World!';
		inputElement!.value = text;
		inputElement!.dispatchEvent(new Event('input', { bubbles: true }));
		(dot as any).flushSync();
		expect(inputElement!.value).toBe(text);
	
		// Simulate blurring the input
		inputElement!.blur();
		inputElement!.dispatchEvent(new Event('change', { bubbles: true }));
		(dot as any).flushSync();
		expect(mockChangeHandler).toHaveBeenCalled();
		expect(mockBlurHandler).toHaveBeenCalled();
		expect(document.activeElement).not.toBe(inputElement);
	});
});

describe("Values.", ()=>{

	test("Input gets updated.", ()=>{

		let obs = dot.state("abc");
		
		dot(document.body).input({ id: "my-input", value: obs });
		let input = document.getElementById("my-input") as HTMLInputElement;
		
		// Writing

		expect(input.value).toBe("abc");

		obs.value = ("123");
		(dot as any).flushSync();

		expect(input.value).toBe("123");

		// Reading

		input.value = "abc123";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		(dot as any).flushSync();

		expect(obs.value).toBe("abc123");
	});

	test("Nested input gets updated.", ()=>{
		// This test is different from above because the value is set before the input is rendered.

		let obs = dot.state("abc");
		
		dot(document.body).div(dot.input({ id: "my-input", value: obs }));
		let input = document.getElementById("my-input") as HTMLInputElement;
		
		expect(input.value).toBe("abc");

		obs.value = ("123");
		(dot as any).flushSync();

		expect(input.value).toBe("123");
	});

	test("Check gets updated.", ()=>{

		let obs = dot.state(true);

		dot(document.body).input({ id: "my-input", type: "checkbox", checked: obs });
		let input = document.getElementById("my-input") as HTMLInputElement;
		
		expect(input.checked).toBe(true);

		obs.value = (false);
		(dot as any).flushSync();

		expect(input.checked).toBe(false);

		input.checked = true;
		input.dispatchEvent(new Event("input", { bubbles: true }));
		(dot as any).flushSync();

		expect(obs.value).toBe(true);
	});

	test("Radio gets updated.", ()=>{

		let obs1 = dot.state(true);
		let obs2 = dot.state(false);
		let obs3 = dot.state(false);

		dot(document.body)
			.input({ id: "my-input-1", name: "group-1", type: "radio", checked: obs1 })
			.input({ id: "my-input-2", name: "group-1", type: "radio", checked: obs2 })
			.input({ id: "my-input-3", name: "group-1", type: "radio", checked: obs3 })
			.input({ id: "my-input-4", name: "group-2", type: "radio", checked: true });

		let input1 = document.getElementById("my-input-1") as HTMLInputElement;
		let input2 = document.getElementById("my-input-2") as HTMLInputElement;
		let input3 = document.getElementById("my-input-3") as HTMLInputElement;
		let input4 = document.getElementById("my-input-4") as HTMLInputElement;
		
		expect(input1.checked).toBe(true);
		expect(input2.checked).toBe(false);
		expect(input3.checked).toBe(false);
		expect(input4.checked).toBe(true);//
		
		obs1.value = (false);
		(dot as any).flushSync();
		
		expect(input1.checked).toBe(false);
		expect(input2.checked).toBe(false);
		expect(input3.checked).toBe(false);
		expect(input4.checked).toBe(true);//
		
		obs1.value = (true);
		(dot as any).flushSync();

		expect(input1.checked).toBe(true);
		expect(input2.checked).toBe(false);
		expect(input3.checked).toBe(false);
		expect(input4.checked).toBe(true);//
		
		obs2.value = (true);
		(dot as any).flushSync();
		// Programmatic update of one radio doesn't automatically update other signals in the group yet.
		// input2.dispatchEvent(new Event("input", { bubbles: true }));
		// (dot as any).flushSync();
		// (dot as any).flushSync();

		expect(input1.checked).toBe(false);
		expect(input2.checked).toBe(true);
		expect(input3.checked).toBe(false);
		// expect(obs1.value).toBe(false); 
		expect(input4.checked).toBe(true);//
		
		input3.checked = true;
		input3.dispatchEvent(new Event("input", { bubbles: true }));
		(dot as any).flushSync();
		
		expect(input1.checked).toBe(false);
		expect(input2.checked).toBe(false);
		expect(input3.checked).toBe(true);
		expect(input4.checked).toBe(true);//
		// expect(obs2.value).toBe(false);
		expect(obs3.value).toBe(true);
	});

	test("Radio with special bindings gets updated.", ()=>{

		let obs1 = dot.state("TRUE");
		let obs2 = dot.state("FALSE");
		let obs3 = dot.state("FALSE");

		dot(document.body)
			.input({ id: "my-input-1", name: "group-1", type: "radio", checked: obs1.bindAs({display: v=>v=="TRUE"}) })
			.input({ id: "my-input-2", name: "group-1", type: "radio", checked: obs2.bindAs({display: v=>v=="TRUE"}) })
			.input({ id: "my-input-3", name: "group-1", type: "radio", checked: obs3.bindAs({display: v=>v=="TRUE"}) })
			.input({ id: "my-input-4", name: "group-2", type: "radio", checked: true });

		let input1 = document.getElementById("my-input-1") as HTMLInputElement;
		let input2 = document.getElementById("my-input-2") as HTMLInputElement;
		let input3 = document.getElementById("my-input-3") as HTMLInputElement;
		let input4 = document.getElementById("my-input-4") as HTMLInputElement;
		
		expect(input1.checked).toBe(true);
		expect(input2.checked).toBe(false);
		expect(input3.checked).toBe(false);
		expect(input4.checked).toBe(true);//
		
		obs1.value = ("FALSE");
		(dot as any).flushSync();
		
		expect(input1.checked).toBe(false);
		expect(input2.checked).toBe(false);
		expect(input3.checked).toBe(false);
		expect(input4.checked).toBe(true);//
		
		obs1.value = ("TRUE");
		(dot as any).flushSync();

		expect(input1.checked).toBe(true);
		expect(input2.checked).toBe(false);
		expect(input3.checked).toBe(false);
		expect(input4.checked).toBe(true);//
		
		obs2.value = ("TRUE");
		(dot as any).flushSync();
		// Programmatic update of one radio doesn't automatically update other signals in the group yet.
		// input2.dispatchEvent(new Event("input", { bubbles: true }));
		// (dot as any).flushSync();
		// (dot as any).flushSync();

		expect(input1.checked).toBe(false);
		expect(input2.checked).toBe(true);
		expect(input3.checked).toBe(false);
		// expect(obs1.value).toBe("FALSE");
		expect(input4.checked).toBe(true);//
		
		input3.checked = true;
		input3.dispatchEvent(new Event("input", { bubbles: true }));
		(dot as any).flushSync();
		
		expect(input1.checked).toBe(false);
		expect(input2.checked).toBe(false);
		// expect(input3.checked).toBe(true);
		expect(input4.checked).toBe(true);//
		// expect(obs2.value).toBe("FALSE");
		// expect(obs3.value).toBe("TRUE");
	});

	test("Text area one way binding.", ()=>{

		let obs = dot.state("abc");
		
		dot(document.body).textArea(obs, { id: "my-input" });
		let input = document.getElementById("my-input") as HTMLTextAreaElement;
		
		// Writing

		expect(input.value).toBe("abc");

		obs.value = ("123");
		(dot as any).flushSync();

		expect(input.value).toBe("123");

		// Reading

		input.value = "abc123";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		(dot as any).flushSync();

		expect(obs.value).toBe("123");
	});

	test("Value attribute should override textarea text.", ()=>{

		let obs = dot.state("abc");
		
		dot(document.body).textArea("123", {id: "my-input", value: obs});
		(dot as any).flushSync();
		expect((document.getElementById("my-input") as HTMLTextAreaElement).value).toBe("abc");
	});

	test("Text area signal should overwrite value.", ()=>{

		let obs = dot.state("abc");
		let obs2 = dot.state("123");
		
		dot(document.body).textArea(obs2, {id: "my-input", value: obs});
		(dot as any).flushSync();

		expect((document.getElementById("my-input") as HTMLTextAreaElement).value).toBe("abc");
		expect(obs.value).toBe("abc");
	});

	test("Text area gets updated.", ()=>{

		let obs = dot.state("abc");
		
		dot(document.body).textArea({id: "my-input", value: obs});
		(dot as any).flushSync();
		let input = document.getElementById("my-input") as HTMLTextAreaElement;
		
		// Writing

		expect(input.value).toBe("abc");

		obs.value = ("123");
		(dot as any).flushSync();

		expect(input.value).toBe("123");

		// Reading

		input.value = "abc123";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		(dot as any).flushSync();

		expect(obs.value).toBe("abc123");
	});

	// TODO: test binding on the options themselves.
	test("Select gets updated.", ()=>{

		let obs = dot.state("1");
		
		dot(document.body).select(
			{ value: obs, id: "my-input" },
			
			dot.option( { id: "option-1", value: "1" })
			.option({ id: "option-2", value: "2" })
			.option({ id: "option-3", value: "3" }),
		);
		let input = document.getElementById("my-input") as HTMLSelectElement;
		let opt1 = document.getElementById("option-1") as HTMLOptionElement;
		let opt2 = document.getElementById("option-2") as HTMLOptionElement;
		let opt3 = document.getElementById("option-3") as HTMLOptionElement;
		
		// Writing

		expect(opt1.selected).toBe(true);
		expect(opt2.selected).toBe(false);
		expect(opt3.selected).toBe(false);
		expect(input.value).toBe("1");
		
		obs.value = ("2");
		(dot as any).flushSync();
		
		expect(opt1.selected).toBe(false);
		expect(opt2.selected).toBe(true);
		expect(opt3.selected).toBe(false);
		expect(input.value).toBe("2");
		
		// Reading
		
		input.value = "3";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		(dot as any).flushSync();
		
		expect(opt1.selected).toBe(false);
		expect(opt2.selected).toBe(false);
		expect(opt3.selected).toBe(true);
		expect(obs.value).toBe("3");
		
		opt1.selected = true;
		opt1.dispatchEvent(new Event("input", { bubbles: true }));
		(dot as any).flushSync();
		expect(opt1.selected).toBe(true);
		expect(opt2.selected).toBe(false);
		expect(opt3.selected).toBe(false);
		expect(obs.value).toBe("1");
	});
});
