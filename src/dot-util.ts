// Polyfill for Object.keys(...).forEach.

import type Component from "./component";

export function eachK(obj, cb){
    if(obj){
        var lst = Object.keys(obj);
        for(var i = 0; i < lst.length; i++) cb(lst[i], obj[lst[i]]);
    }
}

export function isF(v){
    return v && v.constructor && v.call && v.apply;
}

export const sT = setTimeout;
export function str(s: number,v?:number){return (s||"").toString(v)} // This function seems really weird.

class _ClassPrefix{
    private current: number = 0x10000; 
    
    reset(){
        this.current = 0x10000;
    }

    get next(): number{
        return this.current++;
    }
}

export const ClassPrefix = new _ClassPrefix()

export const GlobalComponentStack: Array<Component> = [];