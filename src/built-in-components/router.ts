// ROUTING:
// TODO: Put this in the register hook for router.

import Component from "component";
import dot from "dot";
import ERR from "err";




interface RouterParams{
	autoNavigate: boolean;
	onNavigateInit: Function;
	onError: Function;
	onResponse: Function;
	onComplete: Function;
	routes: Array<{
		path: string
	}>;
}

export default class DotRouter extends Component{

	// TODO: Test to make sure allRouters get cleared when a nested router gets deleted.
	static allRouters: {[key: string]: DotRouter} = {}; 
	static routerId = 1;
	static mayRedirect = false;

	static _get(url, success, fail){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if(this.readyState == 4){
				if (this.status == 200) {
					success && success(this);
				}
				else{
					fail && fail(this);
				}
			}
		};
		xhttp.open("GET", url, true);
		xhttp.send();
	}

	static routerEventSet = false;
	static setupPopupFunction(){
		!DotRouter.routerEventSet && (DotRouter.routerEventSet = true) ? window.onpopstate = function(e){
			if(e.state){
				dot.navigate(e.state.path, true);
				document.title = e.state.pageTitle;
			}
		} : 0;
	}

	id: number = 0;
	outlet: Element = null;
	navId: number = 0;
	currentRoute: string = null;
	currentParams: RouterParams = null;
	params: RouterParams;
	routesAndSegments: Array<{
		path: string,
		segments: string[]
	}> = [];

	constructor(params: RouterParams){
		super();
		this.params = params;
	}

	/**
	 * TODO: convert to interface.
	 * @param {Object} params - Parameters.
	 * @param {Array.<{path: string, title: string, component: Object}>} params.routes - Array of routes.
	 * @param {boolean} params.autoNavigate - Router will automatically navigate when outlet is created.
	 * @param {Function} params.onNavigateInit - Occurs before any request is sent, and before the router outlet is emptied.
	 * @param {Function} params.onError - Occurs in the event of an HTTP error.
	 * @param {Function} params.onResponse - Occurs after a successful HTTP response, but before rendering.
	 * @param {Function} params.onComplete - Occurs after an uncancelled route completes without an error.
	 */
	builder() {
		let t = this;

		if(!t.params || !t.params.routes) ERR("R");;
		t.routesAndSegments = t.params.routes.map(r => {
			if(r.path === null || r.path === undefined) ERR("R");
			return { path: r.path, segments: r.path.split("/") };
		});
		
		//t.navigate = function(p, nh, f){return routerNavigate.call(t, p, nh, f)};
		
		
		if(t.params.autoNavigate === undefined) t.params.autoNavigate = true;
		var o = dot.el("dothtml-router");
		t.outlet = o.getLast();
		t.id = DotRouter.routerId++;
		DotRouter.allRouters[t.id] = t;
		// This use to be here, but not sure what the point of it is anymore. It's not used anywhere.
		// t.outlet.dothtmlRouterId = t.id;
		return o;
	}

	registered(): void {
		
	}

	ready(): void {
		// If there is a route left inside the route queue
		DotRouter.setupPopupFunction();
		
		// TODO: this method is messed up. Params might not be set when replaceState is called.
		if(this.params.autoNavigate){
			DotRouter.mayRedirect = true;
			var params = this.navigate(window.location.pathname + (window.location.hash || ""), true);
			DotRouter.mayRedirect = false;
		}

		if(history.pushState) history.replaceState({"pageTitle":params.title || document.title, "path": params.path}, "", params.path);
		else window.location.hash = params.path;
	}

	deleting(): void {
		delete DotRouter.allRouters[this.id];
	}

	navigate(path: string, noHistory: boolean = false, force: boolean = false){
		let t = this;
		//console.log("NAVIGATING", path);
		// Step 1: parse the path into a route queue:
		path = path || "";
		if(typeof path != "string") path = path + "";
		var hashPath = path;
		if(path.indexOf("#") != -1) hashPath = path.split("#")[1];
		
		var hashParts = path.split("#");
		var allQueues = [];
		
		// Route navigating.
		var routeQueue = hashParts[0].split("?")[0].split("/");
		routeQueue[0] === "" ? routeQueue.shift() : 0;
		allQueues.push(routeQueue);

		// Hash navigating.
		var tryHashQueue = hashParts.length > 1 ? hashParts[1].split("/") : null;
		tryHashQueue ? ((tryHashQueue[0] === "" ? tryHashQueue.shift() : 0)) : 0;
		tryHashQueue ? ((routeQueue.length > 1 ? allQueues.push(tryHashQueue) : allQueues.unshift(tryHashQueue))) : 0;

		var cancel = false;
		var navParams = {
			cancel: function(){
				cancel = true; 
				navParams.wasCancelled = true;
			},
			element: t.outlet,
			httpResponse: null,
			isNew: true,
			params: null,
			path: path,
			title: null,
			wasCancelled: false
		};

		// Step 2: determine the last router that is correctly loaded.

		// var deepestRouter = null;
		var bestRoute = null;
		// Loop through the router stack from start to finish to find the deepest router and the best route to take.
		// for(var i = 0; i < routerOutletStack.length; i++){

		// var candidate = routerOutletStack[i];
		// Find the an available route that matches.
		// bestRoute = null;
		for(var q in allQueues){
			var Q = allQueues[q];
			var rFound = false;
			for(var r in t.routesAndSegments){
				rFound = true;
				var nextRoute = t.routesAndSegments[r];
				var prms = {};
				var rs = 0;
				var ps = 0;
				var lastRn = null;
				while(1){
					var rSn = nextRoute.segments[rs] || null;
					var pSn = Q[ps] || null;
					if(rSn === null && pSn === null) break;
					if(rSn === null && pSn !== null || rSn !== null && pSn === null) {
						rFound = false;
						break;
					}
					if(rSn === null && lastRn == "*") rSn = "*";

					if(rSn == pSn || rSn == "+" || rSn == "*"){ // It's the route, or it's a wildcard.
						rs++;
					}
					else if(rSn.length > 2 && rSn.charAt(0) == "{" && rSn.charAt(rSn.length - 1) == "}"){ // It's a parameterized route.
						rs++;
						prms[rSn.substring(1, rSn.length - 1)] = pSn;
					}
					else if(lastRn != "*"){ // If the route doesn't match but the previous term was a super-wildcard, do nothing. Else, break.
						rFound = false;
						break;
					}
					ps++;
					lastRn = rSn;
				}
				if(rFound){
					bestRoute = nextRoute;
					navParams.params = prms;
					break;
				}
			}
			if(rFound){
				if(Q == routeQueue) {
					if(!history.pushState && DotRouter.mayRedirect) {
						window.location.hash = path;
						window.location.pathname = "/";
						return;
					}
					break;
				};
				if(Q == tryHashQueue) {
					path = hashPath;
					navParams.path = path;
					if(history.pushState) {
						window.location.hash = "";
						history.replaceState({"pageTitle":document.title, "path": path}, document.title, path);
					}
					break;
				};
			}
		}

		navParams.isNew = !(!force && t.currentRoute == bestRoute && (!t.currentParams || t.currentParams == navParams.params || JSON.stringify(t.currentParams) === JSON.stringify(navParams.params)));
		
		t.params.onNavigateInit && t.params.onNavigateInit(navParams);

		if(!navParams.isNew || cancel) return navParams;
		t.currentRoute = bestRoute;
		t.currentParams = navParams.params;

		
		var ro = t.outlet;
		dot(ro).empty();
		var navId = ++t.navId;


		//if(deepestRouter == null) return this;
		if(routeQueue.length == 0) return navParams;
		if(bestRoute == null) return navParams;

		navParams.title = bestRoute.title;

		if(typeof bestRoute.component == "string"){
			DotRouter._get(bestRoute.component, function(result){
				var text = result.responseText;
				navParams.httpResponse = result;
				if(navId != t.navId) return navParams;
				t.params.onResponse && t.params.onResponse(navParams);
				if(cancel) return navParams;
				if(bestRoute.component.split("?")[0].split("#")[0].toLowerCase().indexOf(".js") == bestRoute.component.length - 3){
					try{
						text = Function("var exports=null,module={},route=arguments[0];" + text + "\r\nreturn module.exports || exports;")(navParams);
					}
					catch(e){
						//e.fileName = bestRoute.component;
						console.error(e);
					}
				}
				dot(ro).h(text);
				t.params.onComplete && t.params.onComplete(navParams);
			}, function(result){
				navParams.httpResponse = result;
				t.params.onError && t.params.onError(navParams);
			});
		}
		else{
			dot(ro).h(bestRoute.component.call(dot, navParams));
			t.params.onComplete && t.params.onComplete(navParams);
		}

		return navParams;
	}
}

// Extend dot.
dot.navigate = function(path: string, noHistory: boolean = false, force: boolean = false){

	DotRouter.setupPopupFunction();

	var K = Object.keys(DotRouter.allRouters);
	var lastNavParams: {[key: string]: unknown} = {};
	var bestTitle = document.title;
	for(var k = 0; k < K.length; k++){
		var kk = K[k];
		var r = DotRouter.allRouters[kk];
		if(r) {
			var currentNavParams = r.navigate(path, noHistory, force);
			if(currentNavParams.isNew && !currentNavParams.wasCancelled){
				lastNavParams = currentNavParams;
				bestTitle = (lastNavParams.title as string) || bestTitle;
			}
		}
	}

	try{
		if(lastNavParams && !noHistory){
			//if(history.replaceState) history.replaceState({"pageTitle":title, "path": path}, title, path);
			if(history.pushState) history.pushState({"pageTitle":bestTitle, "path": lastNavParams.path}, bestTitle, (lastNavParams.path as string));
			else window.location.hash = (lastNavParams.path as string);
		}
	}catch(e){}

	return this;
}