
export default interface IEventBus{
    
    on (event, callback);
    
    off (event, callback);
    
    emit (event, ...args);
    
    flush (event);
}