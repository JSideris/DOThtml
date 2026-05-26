
if (typeof window !== "undefined") {
	window.scrollTo = jest.fn();
	Element.prototype.scrollIntoView = jest.fn();
}
