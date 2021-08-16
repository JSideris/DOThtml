// Polyfill for Object.keys(...).forEach.

export function eachK(obj, cb){
    if(obj){
        var lst = Object.keys(obj);
        for(var i = 0; i < lst.length; i++) cb(lst[i], obj[lst[i]]);
    }
}

export function isF(v){
    return v && v.constructor && v.call && v.apply;
}

