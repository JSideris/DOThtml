
var NodePolyfill: unknown = window.Node;
if(!Node){
	NodePolyfill = class{
		ELEMENT_NODE: number = 1;
		ATTRIBUTE_NODE: number = 2;
		TEXT_NODE: number = 3;
	};
}

export default (NodePolyfill as Node);