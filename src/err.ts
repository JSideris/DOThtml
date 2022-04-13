var ERR = function(c: string, ...p: Array<string>){throw "DOThtml usage error code " + c + ". Use an unminified version for more information."};
;;;ERR = function(c: string, ...p: Array<string>){
	p = p || [];
	throw {
		"A": `Can't append "${p[0]}".`,
		// "CC": "The name \"" + p[0] + "\" conflicts with an existing DOThtml function.",
		"CB": "Unable to build the same component twice. Ensure each component is only used once.",
		"CU": "Invalid usage: a component should at least have a name and a builder function.",
		"C#": `Component "${p[0]}" must return exactly one child node.`,
		"F": `Element "${p[0]}" not found.`,
		"MC": "Can't mix static conditions with dynamic conditional rendering.",
		"R": "Router must be passed a JSON object that contains an 'routes' array containing objects with a 'path', 'title', and 'component'.",
		"S": "SVG is not supported by DOThtml.",
		"UE": `Unknown event name "${p[0]}".`,
		"XS": "Expected a string.",
		"XF": `Expected a function in "${p[0]}".`,
		//"SF": "The style property of a component must be a string, a function that returns a string, or a JSON collection of those things."
	}[c] || "Unknown error.";
	
};

export default ERR;