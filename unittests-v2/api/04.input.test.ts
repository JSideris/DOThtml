import { dot } from "../../src";
import { DOT_VDOM_PROP_NAME } from "../../src/constants";

afterEach(() => { 
	document.body.innerHTML = ''; 
	document.body[DOT_VDOM_PROP_NAME] = null;
});

describe("DOM events.", ()=>{
	test("Button click.", ()=>{
		let mockClickHandler = jest.fn();

		dot(document.body).button().id("my-button").onClick(mockClickHandler);
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

		dot(document.body).input().id("my-input").onFocus(mockFocusHandler).onBlur(mockBlurHandler).onChange((mockChangeHandler));
		let inputElement = document.getElementById("my-input") as HTMLInputElement;
		
		// Mock functions to simulate focus and blur event handlers
	
		// Simulate focusing on the input
		inputElement!.focus();
		expect(mockFocusHandler).toHaveBeenCalled();
		expect(document.activeElement).toBe(inputElement);
	
		// Simulate typing into the input
		const text = 'Hello, World!';
		inputElement!.value = text;
		inputElement!.dispatchEvent(new Event('input'));
		expect(inputElement!.value).toBe(text);
	
		// Simulate blurring the input
		inputElement!.blur();
		inputElement!.dispatchEvent(new Event('change'));
		expect(mockChangeHandler).toHaveBeenCalled();
		expect(mockBlurHandler).toHaveBeenCalled();
		expect(document.activeElement).not.toBe(inputElement);
	});
});

describe("Values.", ()=>{

	test("Input gets updated.", ()=>{

		let obs = dot.watch({value: "abc"});
		
		dot(document.body).input().id("my-input").value(obs);
		let input = document.getElementById("my-input") as HTMLInputElement;
		
		// Writing

		expect(input.value).toBe("abc");

		obs.setValue("123");

		expect(input.value).toBe("123");

		// Reading

		input.value = "abc123";
		input.dispatchEvent(new Event("input"));

		expect(obs.getValue()).toBe("abc123");
	});

	test("Nested input gets updated.", ()=>{
		// This test is different from above because the value is set before the input is rendered.

		let obs = dot.watch({value: "abc"});
		
		dot(document.body).div(dot.input().id("my-input").value(obs));
		let input = document.getElementById("my-input") as HTMLInputElement;
		
		expect(input.value).toBe("abc");

		obs.setValue("123");

		expect(input.value).toBe("123");
	});

	test("Check gets updated.", ()=>{

		let obs = dot.watch({value: true});

		dot(document.body).input().id("my-input").type("checkbox").checked(obs);
		let input = document.getElementById("my-input") as HTMLInputElement;
		
		expect(input.checked).toBe(true);

		obs.setValue(false);

		expect(input.checked).toBe(false);

		input.checked = true;
		input.dispatchEvent(new Event("input"));

		expect(obs.getValue()).toBe(true);
	});

	test("Radio gets updated.", ()=>{

		let obs1 = dot.watch({value: true});
		let obs2 = dot.watch({value: false});
		let obs3 = dot.watch({value: false});

		dot(document.body)
			.input().id("my-input-1").name("group-1").type("radio").checked(obs1)
			.input().id("my-input-2").name("group-1").type("radio").checked(obs2)
			.input().id("my-input-3").name("group-1").type("radio").checked(obs3)
			.input().id("my-input-4").name("group-2").type("radio").checked(true);

		let input1 = document.getElementById("my-input-1") as HTMLInputElement;
		let input2 = document.getElementById("my-input-2") as HTMLInputElement;
		let input3 = document.getElementById("my-input-3") as HTMLInputElement;
		let input4 = document.getElementById("my-input-4") as HTMLInputElement;
		
		expect(input1.checked).toBe(true);
		expect(input2.checked).toBe(false);
		expect(input3.checked).toBe(false);
		expect(input4.checked).toBe(true);//
		
		obs1.setValue(false);
		
		expect(input1.checked).toBe(false);
		expect(input2.checked).toBe(false);
		expect(input3.checked).toBe(false);
		expect(input4.checked).toBe(true);//
		
		obs1.setValue(true);

		expect(input1.checked).toBe(true);
		expect(input2.checked).toBe(false);
		expect(input3.checked).toBe(false);
		expect(input4.checked).toBe(true);//
		
		obs2.setValue(true);

		expect(input1.checked).toBe(false);
		expect(input2.checked).toBe(true);
		expect(input3.checked).toBe(false);
		expect(obs1._value).toBe(false);
		expect(input4.checked).toBe(true);//
		
		input3.checked = true;
		input3.dispatchEvent(new Event("input"));
		
		expect(input1.checked).toBe(false);
		expect(input2.checked).toBe(false);
		expect(input3.checked).toBe(true);
		expect(input4.checked).toBe(true);//
		expect(obs2._value).toBe(false);
		expect(obs3._value).toBe(true);
	});

	test("Text area one way binding.", ()=>{

		let obs = dot.watch({value: "abc"});
		
		dot(document.body).textArea(obs).id("my-input");
		let input = document.getElementById("my-input") as HTMLTextAreaElement;
		
		// Writing

		expect(input.value).toBe("abc");

		obs.setValue("123");

		expect(input.value).toBe("123");

		// Reading

		input.value = "abc123";
		input.dispatchEvent(new Event("input"));

		expect(obs.getValue()).toBe("123");
	});

	test("Value attribute should override textarea text.", ()=>{

		let obs = dot.watch({value: "abc"});
		
		dot(document.body).textArea("123").id("my-input").value(obs);
		expect((document.getElementById("my-input") as HTMLTextAreaElement).value).toBe("abc");
	});

	test("Text area watcher should overwrite value.", ()=>{

		let obs = dot.watch({value: "abc"});
		let obs2 = dot.watch({value: "123"});
		
		dot(document.body).textArea(obs2).id("my-input").value(obs);

		expect((document.getElementById("my-input") as HTMLTextAreaElement).value).toBe("abc");
		expect(obs).toBe("abc");
	});

	test("Text area gets updated.", ()=>{

		let obs = dot.watch({value: "abc"});
		
		dot(document.body).textArea().id("my-input").value(obs);
		let input = document.getElementById("my-input") as HTMLTextAreaElement;
		
		// Writing

		expect(input.value).toBe("abc");

		obs.setValue("123");

		expect(input.value).toBe("123");

		// Reading

		input.value = "abc123";
		input.dispatchEvent(new Event("input"));

		expect(obs.getValue()).toBe("abc123");
	});

	// TODO: test binding on the options themselves.
	test("Select gets updated.", ()=>{

		let obs = dot.watch({value: "1"});
		
		dot(document.body).select(
			dot.option()
				.id("option-1")
				.value("1")
			.option()
				.id("option-2")
				.value("2")
			.option()
				.id("option-3")
				.value("3")
		).value(obs)
			.id("my-input");
		let input = document.getElementById("my-input") as HTMLSelectElement;
		let opt1 = document.getElementById("option-1") as HTMLOptionElement;
		let opt2 = document.getElementById("option-2") as HTMLOptionElement;
		let opt3 = document.getElementById("option-3") as HTMLOptionElement;
		
		// Writing

		expect(opt1.selected).toBe(true);
		expect(opt2.selected).toBe(false);
		expect(opt3.selected).toBe(false);
		expect(input.value).toBe("1");
		
		obs.setValue("2");
		
		expect(opt1.selected).toBe(false);
		expect(opt2.selected).toBe(true);
		expect(opt3.selected).toBe(false);
		expect(input.value).toBe("2");
		
		// Reading
		
		input.value = "3";
		input.dispatchEvent(new Event("input"));
		
		expect(opt1.selected).toBe(false);
		expect(opt2.selected).toBe(false);
		expect(opt3.selected).toBe(true);
		expect(obs.getValue()).toBe("3");
		
		opt1.selected = true;
		opt1.dispatchEvent(new Event("input"));
		expect(opt1.selected).toBe(true);
		expect(opt2.selected).toBe(false);
		expect(opt3.selected).toBe(false);
		expect(obs.getValue()).toBe("1");
	});
});
