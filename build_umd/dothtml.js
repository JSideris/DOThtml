(()=>{"use strict";const e="_dotVDom";function t(t,n){if(t.parentNode!==n.parentNode)throw new Error("Start and end nodes must have the same parent.");let r=t.nextSibling;for(;r&&r!==n;){const t=r.nextSibling;r[e]?r[e]._unrender():r.parentNode?.removeChild(r),r=t}}function n(e,t,r=new Map){if(e===t)return!0;if(null==e||null==t||"object"!=typeof e||"object"!=typeof t)return!1;if(r.has(e))return r.get(e)===t;if(r.set(e,t),Array.isArray(e)&&Array.isArray(t)&&e.length!==t.length)return!1;for(const o in e){if(!t.hasOwnProperty(o))return!1;if(!n(e[o],t[o],r))return!1}for(const n in t)if(!e.hasOwnProperty(n))return!1;return!0}class r{constructor(){this.observingTextNodes={},this.observingHtmlNodes={},this.observingAttributes={},this.observingCollections={},this.observingConditionals={},this.observingCallbacks={},this.nextId=1}getValue(){return this.transformer?this.transformer(this._value):this._value}setValue(e){this._value=e;let t=this.getValue();this._cachedLastValue!=t&&(this._cachedLastValue=t,this.updater(t))}updater(e){for(let t in this.observingTextNodes)this.observingTextNodes[t].textNode.textContent=e??"";for(let t in this.observingHtmlNodes)this.observingHtmlNodes[t].updateHtml(e);for(let e in this.observingAttributes){let t=this.observingAttributes[e];t.element.setAttr(t.attribute,this)}for(let e in this.observingCollections)this.observingCollections[e].collection.updateList();for(let e in this.observingConditionals)this.observingConditionals[e].updateConditions();for(let t in this.observingCallbacks)(0,this.observingCallbacks[t])(e)}subscribeText(e){let t=0+6*this.nextId++;return this.observingTextNodes[t]=e,t}subscribeHtml(e){let t=1+6*this.nextId++;return this.observingHtmlNodes[t]=e,t}subscribeAttr(e,t){let n=2+6*this.nextId++;return this.observingAttributes[n]={element:e,attribute:t},n}subscribeCollection(e){let t=4+6*this.nextId++;return this.observingCollections[t]={collection:e,key:null},t}subscribeCond(e){let t=3+6*this.nextId++;return this.observingConditionals[t]=e,t}subscribeCallback(e){let t=5+6*this.nextId++;return this.observingCallbacks[t]=e,t}detachBinding(e){switch(e%6){case 0:delete this.observingTextNodes[e];break;case 2:delete this.observingAttributes[e];break;case 1:delete this.observingHtmlNodes[e];break;case 4:delete this.observingCollections[e];break;case 3:delete this.observingConditionals[e];break;case 5:delete this.observingCallbacks[e]}}updateObservers(){let e=this.getValue();this._cachedLastValue=e,this.updater(e)}}class o{toString(){let e=document.createElement("div");return this._render(e),e.innerHTML}_renderBefore(e){let t=e.ownerDocument.createElement("div");for(this._render(t);t.childNodes.length>0;){let n=t.childNodes[0];n.parentElement.removeChild(n),e.parentElement.insertBefore(n,e)}}_renderAfter(e){if(e.nextSibling)this._renderBefore(e.nextSibling);else{let t=e.ownerDocument.createTextNode("");e.parentElement.appendChild(t),this._renderBefore(t),t.parentElement.removeChild(t)}}}class i extends o{constructor(e){super(),this.textNode=null,this.observerId=0,this.text=e}_render(e){this.text instanceof r?(this.textNode=e.ownerDocument.createTextNode(this.text.getValue()??""),this.observerId=this.text.subscribeText(this)):this.textNode=e.ownerDocument.createTextNode(`${this.text??""}`),e.appendChild(this.textNode)}_unrender(){this.textNode&&(this.textNode.parentElement.removeChild(this.textNode),this.textNode=null),this.observerId&&this.text instanceof r&&(this.text.detachBinding(this.observerId),this.observerId=0)}toString(){let e=document.createTextNode((this.text instanceof r?this.text.getValue():this.text)??""),t=document.createElement("div");return t.appendChild(e),t.innerHTML}}class s extends o{constructor(e,t){super(),this.observerId=0,this.mappedItems=[],this.value=e,this.renderCallback=t}_render(e){this.value instanceof r&&(this.observerId=this.value.subscribeCollection(this)),this.startNode=e.ownerDocument.createTextNode(""),this.endNode=e.ownerDocument.createTextNode(""),e.appendChild(this.startNode),e.appendChild(this.endNode),this.updateList()}_unrender(){this.observerId&&this.value instanceof r&&(this.value.detachBinding(this.observerId),this.observerId=null);for(let e=0;e<this.mappedItems.length;e++){let t=this.mappedItems[e];t.vdom._unrender(),t.afterNode.parentElement.removeChild(t.afterNode)}this.mappedItems.length=0,this.startNode.parentElement.removeChild(this.startNode),this.endNode.parentElement.removeChild(this.endNode),this.startNode=null,this.endNode=null}removeItem(e){e.vdom._unrender(),e.afterNode.parentElement.removeChild(e.afterNode)}updateList(){let e,t=null;{let n=null;if(this.value instanceof r?(n=this.value.getValue(),t=this.value.key??null):n=this.value,n instanceof Array)e=n.map(((e,n)=>({vdom:null,value:e,keyValue:t?e[t]:null,afterNode:null,observableIndex:new r})));else{e=[];for(let o in n){let i=n[o],s=t?i[t]:o;e.push({vdom:null,value:i,keyValue:s,afterNode:null,observableIndex:new r})}}}{let n=0,r=0,o=0;for(;n<this.mappedItems.length;){let i=this.mappedItems[n],s=e[o];s?s==i||t&&s.keyValue==i.keyValue?(r++,n++,o=r):o++:(this.removeItem(i),this.mappedItems.splice(n,1),o=r)}}{let s=0,a=0,d=this.startNode;for(;a<e.length;){let l=this.mappedItems[s],h=e[a];if(l&&(h==l||t&&h.keyValue==l.keyValue))n(l.value,h.value)?l.observableIndex.setValue(a):(l.vdom._unrender(),l.vdom=this.renderCallback(h.value,this.value instanceof r?l.observableIndex:a,h.keyValue),l.value=h.value,l.vdom._renderBefore(l.afterNode)),d=l.afterNode,a++,s++;else{let e=d.ownerDocument.createTextNode(""),t=d.parentElement.nextSibling;t?this.startNode.parentElement.insertBefore(e,t):this.startNode.parentElement.appendChild(e),h.afterNode=e,h.observableIndex._value=a;let n=this.renderCallback(h.value,this.value instanceof r?h.observableIndex:a,h.keyValue);h.vdom=n instanceof o?n:new i(n),h.vdom._renderBefore(h.afterNode),this.mappedItems.splice(a,0,h),a++}}}}}class a extends o{constructor(){super(...arguments),this.conditions=[],this.sealed=!1,this.renderedIndex=-1}addCondition(e,t,n=!1){if(this.sealed)throw new Error("Cannot add additional conditions to a sealed block.");this.sealed=n;let o={condition:e,vNode:t,startAnchor:null,endAnchor:null,observerId:0};this.conditions.push(o),this.conditions[0].startAnchor&&(this.addAnchor(o,this.conditions[0].startAnchor.parentElement),e instanceof r&&(o.observerId=e.subscribeCond(this)),this.updateConditions())}addAnchor(e,t){e.startAnchor=t.ownerDocument.createTextNode(""),e.endAnchor=t.ownerDocument.createTextNode(""),t.appendChild(e.startAnchor),t.appendChild(e.endAnchor)}_render(e){for(let t=0;t<this.conditions.length;t++){let n=this.conditions[t];if(n.startAnchor)throw new Error("Item is already rendered.");this.addAnchor(n,e),n.condition instanceof r&&(n.observerId=n.condition.subscribeCond(this))}this.conditions.length&&this.updateConditions()}_unrender(){if(this.conditions[0].startAnchor){for(let e=0;e<this.conditions.length;e++){let t=this.conditions[e],n=t.startAnchor,o=t.endAnchor;t.vNode._unrender(),n.parentElement.removeChild(n),o.parentElement.removeChild(o),t.startAnchor=null,t.endAnchor=null,t.condition instanceof r&&(t.condition.detachBinding(t.observerId),t.observerId=0)}this.renderedIndex=-1}}updateConditions(){this.conditions[0].startAnchor.parentElement;let e=-1;for(let t=0;t<this.conditions.length;t++){let n=this.conditions[t];if(n.condition instanceof r?n.condition.getValue():n.condition){e=t;break}}if(e!=this.renderedIndex&&(-1!=this.renderedIndex&&this.conditions[this.renderedIndex].vNode._unrender(),this.renderedIndex=e,-1!=e)){let t=this.conditions[e];t.vNode._renderBefore(t.endAnchor)}}}class d extends o{constructor(e){super(),this.children=null,this.tag=null,this.attributes={},this.events=[],this.attributeObserverIds=[],this.tag=e,this.children=new c,this.children._parent=this}_render(t){this.element=t.ownerDocument.createElement(this.tag),this.element[e]=this;for(let e in this.attributes)this.renderAttr(e,this.attributes[e],this.element);t.appendChild(this.element);for(let e=0;e<this.events.length;e++){let t=this.events[e];this.renderEvent(t.name,t.callback)}this.children&&this.children._render(this.element)}_unrender(){this.children._unrender(),this.element.parentNode?.removeChild(this.element),this.element=null;for(let e=0;e<this.attributeObserverIds.length;e++){let t=this.attributeObserverIds[e];t.observable.detachBinding(t.id)}this.attributeObserverIds.length=0}toString(){return this.element?this.element.outerHTML:super.toString()}setAttr(e,t){this.attributes[e]=t,this.element&&this.renderAttr(e,t,this.element)}renderAttr(e,t,n){if("string"==typeof t||"number"==typeof t)n.setAttribute(e,`${t}`);else if("boolean"==typeof t||null==t||null==t)t?n.setAttribute(e,`${t}`):n.removeAttribute(e);else if(t instanceof r){this.renderAttr(e,t.getValue(),n);let r=t.subscribeAttr(this,e);this.attributeObserverIds.push({id:r,observable:t}),"value"!=e&&"checked"!=e||this.element.addEventListener("input",(n=>{t.setValue(this.element[e])}))}}addEventListener(e,t){this.events.push({name:e,callback:t}),this.element&&this.renderEvent(e,t)}renderEvent(e,t){this.element.addEventListener(e.toLowerCase(),t)}}class l extends o{constructor(e){super(),this.observerId=0,this.html=e}updateHtml(e){if(this.beforeNode){t(this.beforeNode,this.afterNode);let n=this.beforeNode.ownerDocument.createElement("div");for(n.innerHTML=e;n.firstChild;)this.afterNode.parentElement.insertBefore(n.firstChild,this.afterNode)}}_render(e){let t="";this.html instanceof r?(t=this.html.getValue(),this.observerId=this.html.subscribeHtml(this)):t=this.html,this.beforeNode=e.ownerDocument.createTextNode(""),this.afterNode=e.ownerDocument.createTextNode(""),e.appendChild(this.beforeNode),e.appendChild(this.afterNode),this.updateHtml(t??"")}_unrender(){if(this.beforeNode){let e=this.beforeNode.parentElement;t(this.beforeNode,this.afterNode),e.removeChild(this.beforeNode),e.removeChild(this.afterNode),this.beforeNode=null,this.afterNode=null}this.observerId&&this.html instanceof r&&(this.html.detachBinding(this.observerId),this.observerId=0)}toString(){return this.html instanceof r?this.html.getValue():this.html}}class h extends o{constructor(e){super(),this.component=e,this.component.creating&&this.component.creating(),this.childShadowVdom=this.component.build&&this.component.build(...e._._meta.args),this.component.built&&this.component.built()}setupCustomElement(e,t){let n=this,r=t.defaultView.customElements.get(e._._meta.tagName);null==r&&(r=class extends HTMLElement{set component(e){this._component=e,this._renderComponent()}_renderComponent(){if(!(n instanceof o))throw new Error("Component build function returned invalid object.");{let e=this.attachShadow({mode:"open"});this._component._.root=e,n.childShadowVdom._render(e)}}},t.defaultView.customElements.define(e._._meta.tagName,r))}_render(e){if(!this.component._)throw new Error("Invalid component. Ensure components are created through the component factory or through decoration.");if(this.component._?._meta?.isRendered)throw new Error("Individual component instances cannot be rendered twice at once.");this.component._._meta||(this.component._._meta={}),this.component._._meta.isRendered=!0;let t=e.ownerDocument;this.setupCustomElement(this.component,t),this.shadowEl=t.createElement(this.component._._meta.tagName),this.shadowEl.component=this.component,e.appendChild(this.shadowEl)}_unrender(){this.component.deleting&&this.component.deleting(),this.childShadowVdom._unrender(),this.childShadowVdom=null,this.shadowEl.remove(),this.shadowEl=null,this.component._._meta.isRendered=!1,this.component.deleted&&this.component.deleted()}toString(){return`<${this.component._._meta.tagName}></${this.component._._meta.tagName}>`}}class c extends o{constructor(){super(),this._children=[],this._parent=null}_addChild(e){return this._children.push(e),this._parent&&this._parent instanceof d&&this._parent.element&&e._render(this._parent.element),this}_render(e){for(let t=0;t<this._children.length;t++)this._children[t]._render(e)}_unrender(){for(let e=0;e<this._children.length;e++)this._children[e]._unrender()}html(e){let t=new l(e);return this._addChild(t)}text(e){let t=new i(e);return this._addChild(t)}mount(e){let t=new h(e);return this._addChild(t)}when(e,t){let n,r=new a;if(t instanceof c)n=t;else{n=new c;let e=new i(t);n._addChild(e),t=n}return r.addCondition(e,t),this._addChild(r),this}otherwiseWhen(e,t,n=!1){let r=this._children[this._children.length-1];if(!(r instanceof a))throw new Error("Can't branch off of a non-conditional node.");{let o;if(t instanceof c)o=t;else{o=new c;let e=new i(t);o._addChild(e),t=o}r.addCondition(e,t,n)}return this}otherwise(e){return this.otherwiseWhen(!0,e,!0)}each(e,t){let n=new s(e,t);return this._addChild(n),this}}let u=65536;function m(e){let t=Math.floor(1e13*performance.now()).toString(16),n=`dothtml-${(u++).toString(16)}${m._addTimestamp?`-${t}`:""}`,r=new CSSStyleSheet;return class extends e{constructor(...e){super(...e),this._={root:null,refs:null,emit:null,restyle:()=>{this._.root&&this._.root},_meta:{isRendered:!1,tagName:n,args:null,sharedStyles:r}},this._._meta.args=e}}}m._addTimestamp=!0;const p=["a","aside","abbr","address","area","article","audio","b","bdi","bdo","blockQuote","body","br","button","canvas","caption","cite","code","col","colGroup","content","data","dataList","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldSet","figCaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hr","i","iFrame","img","input","ins","kbd","keyGen","label","legend","li","main","map","mark","menu","menuItem","meter","nav","object","ol","optGroup","option","output","p","param","pre","progress","q","rp","rt","ruby","s","samp","section","select","small","source","span","strong","svg","sub","summary","sup","table","tBody","td","textArea","tFoot","th","tHead","time","tr","track","u","ul","var","video","wbr"],b=["accept","accessKey","action","align","allow","allowFullScreen","aLink","alt","archive","autoCapitalize","autoComplete","autoFocus","autoPlay","autoSave","axis","background","bgColor","border","buffered","cellPadding","cellSpacing","challenge","char","charset","charOff","checked","class","classId","clear","codeBase","codeType","color","cols","colSpan","compact","contentEditable","contextMenu","controls","coords","crossOrigin","dateTime","declare","decoding","default","dir","dirName","disabled","download","draggable","dropZone","encType","enterKeyHint","exportParts","face","font","fontFace","fontFaceFormat","fontFaceName","fontFaceSrc","fontFaceUri","fontSpecification","for","foreignObject","formAction","frame","frameBorder","headers","height","hidden","high","hRef","hRefLang","hSpace","icon","id","inert","inputMode","images","is","isMap","itemId","itemProp","itemRef","itemScope","itemType","keyType","kind","lang","list","loading","longDesc","loop","low","manifest","marginHeight","marginWidth","max","maxLength","media","metadata","method","min","missingGlyph","multiple","muted","name","noHRef","nOnce","noResize","noShade","noValidate","noWrap","open","optimum","part","pattern","ping","placeholder","playsInline","poster","preload","prompt","radioGroup","readOnly","referrerPolicy","rel","required","rev","reversed","role","rows","rowSpan","rules","sandbox","scope","scrolling","seamless","selected","shape","size","sizes","spellCheck","src","srcDoc","srcLang","srcSet","standby","start","step","style","tabIndex","target","title","translate","type","useMap","vAlign","valueType","virtualKeyboardPolicy","width","wrap"],f=[["quoteCite","cite"],["objectData","data"],["whichForm","form"],["trackLabel","label"],["colSpan","span"],["tableSummary","summary"],["optionLabel","label"],["acceptCharset","accept-charset"],["areaHidden","area-hidden"],["areaLabel","area-label"],["areaDescribedBy","area-describedby"],["areaControls","area-controls"],["areaExpanded","area-expanded"],["areaChecked","area-checked"],["areaSelected","area-selected"]],g=["each","html","mount","text","when"],v=["onAbort","onBlur","onChange","onInput","onCanPlay","onCantPlayThrough","onClick","onCopy","onContextMenu","onCueChange","onCut","onDblClick","onDrag","onDragEnd","onDragEnter","onDragLeave","onDragOver","onDragStart","onDrop","onDurationChange","onEmptied","onEnded","onError","onFocus","onHashChange","onInvalid","onKeyDown","onKeyPress","onKeyUp","onLoad","onLoadedData","onLoadedMetadata","onLoadStart","onMouseDown","onMouseEnter","onMouseLeave","onMouseMove","onMouseOut","onMouseOver","onMouseUp","onPointerCancel","onPointerDown","onPointerEnter","onPointerLeave","onPointerMove","onPointerOut","onPointerOver","onPointerUp","onTouchStart","onTouchEnd","onTouchCancel","onTouchMove","onMouseWheel","onOffline","onOnline","onPageHide","onPagePaste","onPageShow","onPause","onPlay","onPlaying","onPopState","onProgress","onRateChange","onReset","onResize","onScroll","onSearch","onSeeked","onSeeking","onSelect","onStalled","onStorage","onSubmit","onSuspend","onTimeUpdate","onToggle","onUnload","onVolumeChange","onWaiting","onWheel"],_=(e,t)=>{e[t]=function(){let e=new c;return e[t](...arguments),e}},C=(()=>{const t=function(n,r=window){if(n?.ownerDocument?.defaultView){let t=n,r=t[e];return r||(r=new d(t.tagName.toLocaleLowerCase()),r.element=t,r.children._parent=r,t[e]=r),r.children}if("string"==typeof n)return t(r.document.querySelectorAll(n)[0]);throw new Error("Invalid render target.")};t.watch=function(e){let t=new r;return t.key=e?.key,t.transformer=e?.transformer,t.setValue(e?.value),t},t.component=function(e){return m(e)};for(let e=0;e<p.length;e++){let n=p[e];c.prototype[n]=function(e){let t=new d(n);return e instanceof c?t.children=e:e instanceof o?t.children._addChild(e):e?._?._meta&&e?.build?t.children._addChild(new h(e)):null!=e&&t.children._addChild(new i(e)),this._addChild(t)},_(t,n)}for(let e=0;e<b.length;e++){let t=b[e];c.prototype[t]=function(e){let n=this._children[this._children.length-1];if(!(n&&n instanceof d))throw new Error(`Invalid node to set ${t} attribute.`);return n.setAttr(t,e),this}}for(let e=0;e<f.length;e++){let t=f[e];c.prototype[t[0]]=function(e){let n=this._children[this._children.length-1];if(!(n&&n instanceof d))throw new Error(`Invalid node to set ${t[0]} attribute.`);return n.setAttr(t[1],e),this}}c.prototype.value=function(e){let t=this._children[this._children.length-1];if(!(t&&t instanceof d))throw new Error("Invalid node to set value attribute.");return"input"===t.tag&&t.setAttr("value",e),this};for(let e=0;e<v.length;e++){let t=v[e];c.prototype[t]=function(e){let n=this._children[this._children.length-1];if(!(n&&n instanceof d))throw new Error(`Invalid node to set ${t} attribute.`);return n.addEventListener(t.substring(2),e),this}}for(let e=0;e<g.length;e++)_(t,g[e]);return t})();C.version="6.0.0",window.dot=C})();