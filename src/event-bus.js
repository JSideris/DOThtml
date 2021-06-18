import { eachK, isF } from "./util";

function EventBus(){
    this._callbacks = {};
    
}

const _e = EventBus.prototype;

_e._checkAddEvent = function(event){
    var e = this._callbacks[event];
    if(!e) e = this._callbacks[event] = [];
    return e;

}

_e.on = function(event, callback){
    var e = this._checkAddEvent(event);
    e.push(callback);
}

_e.off = function(event, callback){
    var e = this._checkAddEvent(event);
    for(var i = e.length -1; e >=0; i--){
        if(e[i] == callback) e.splice(i, 1);
    }
}

_e.emit = function(event, arg){
    var e = this._checkAddEvent(event);
    eachK(e, function(k, v){
        v(arg);
    });
}

_e.flush = function(event){
    this._checkAddEvent(event).length = 0;
}

export default new EventBus();