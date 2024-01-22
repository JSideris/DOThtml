// import { IDotCore } from "dothtml-interfaces";

// const makeDot = ()=>{
// 	const _dot = function(targetSelector, targetWindow: Window = window){

// 		if(targetSelector?.ownerDocument?.defaultView){
// 			let el = (targetSelector as HTMLElement);
// 			// It's an element.
// 			// Try to get the node out of it.
// 			let node = el[DOT_VDOM_PROP_NAME] as ElementVdom;
// 			if(node){
// 				return node.children;
// 			}
// 			else{
// 				node = new ElementVdom(el.tagName.toLocaleLowerCase());
// 				node.element = el;
// 				node.children._parent = node;
// 				el[DOT_VDOM_PROP_NAME] = node;
// 				return node.children;
// 			}
// 		}
// 		else if(typeof targetSelector == "string"){
// 			return _dot(targetWindow.document.querySelectorAll(targetSelector)[0]);
// 		}
// 		else{
// 			throw new Error("Invalid render target.");
// 		}
// 	}

// 	{ // Elements
// 		for(let i = 0; i < allTags.length; i++){
// 			let E = allTags[i];
// 			ContainerVdom.prototype[E] = function(c){
// 				let n = new ElementVdom(E);
				
// 				if(c instanceof ContainerVdom){
// 					// Note that this creates a redundant new ContainerVdom in the ElementVdom that gets overwritten.
// 					// Perhaps there's a way to eliminate this inefficiency.
// 					n.children = c;
// 				}
// 				else if(c instanceof Vdom){
// 					n.children._addChild(c);
// 				}
// 				else if(c?._?._meta && c?.build){
// 					n.children._addChild(new ComponentVdom(c));
// 				}
// 				else{
// 					if(c !== null && c !== undefined){
// 						n.children._addChild(new TextVdom(c));
// 					}
// 				}

// 				return this._addChild(n);

// 				// if(c instanceof ContainerVDomNode){
// 				// 	n = c;
// 				// }
// 				// else{
// 				// 	n = new ContainerVDomNode();
// 				// 	if(c instanceof HtmlVDomNode || c instanceof TextVDomNode){
// 				// 		n._addChild(c);
// 				// 	}
// 				// 	else{
// 				// 		// It's content (assume text). Later we'll add support for other types.
// 				// 		if(c){
// 				// 			let inner = new TextVDomNode(c);
// 				// 			n._addChild(inner);
// 				// 		}
// 				// 	}
// 				// }
// 				// return this._addChild(n);
// 			};
// 			makeCoreWrapper(_dot, E);
// 		}
// 	}

// 	{ // Special core functions.
// 		for(let i = 0; i < allCoreWrappers.length; i++){
// 			let W = allCoreWrappers[i];
// 			makeCoreWrapper(_dot, W);
// 		}
// 	}

// 	return _dot as unknown as IDotCore;
// }

// const dot = makeDot();

// export default dot;
