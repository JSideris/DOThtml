
export default interface IEventBus{
    
    on (event: string, callback: Function): void;
    
    off (event: string, callback: Function): void;
    
    emit (event: string, ...args: any[]): void;
    
    flush (event: string): void;
}
