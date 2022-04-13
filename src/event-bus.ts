import { eachK, isF } from "./dot-util";

class _EventBus{
    private _callbacks = {};
    
    _checkAddEvent = function(event){
        var e = this._callbacks[event];
        if(!e) this._callbacks[event] = e = [];
        return e;
    
    }
    
    on (event, callback){
        var e = this._checkAddEvent(event);
        e.push(callback);
    }
    
    off (event, callback){
        var e = this._checkAddEvent(event);
        for(var i = e.length -1; e >=0; i--){
            if(e[i] == callback) e.splice(i, 1);
        }
    }
    
    emit (event, arg){
        var e = this._checkAddEvent(event);
        eachK(e, function(k, v){
            v(arg);
        });
    }
    
    flush (event){
        this._checkAddEvent(event).length = 0;
    }
}


const EventBus = new _EventBus();
export default EventBus;