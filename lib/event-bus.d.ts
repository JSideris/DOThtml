declare class _EventBus {
    private _callbacks;
    _checkAddEvent: (event: any) => any;
    on(event: any, callback: any): void;
    off(event: any, callback: any): void;
    emit(event: any, ...args: any[]): void;
    flush(event: any): void;
}
declare const EventBus: _EventBus;
export default EventBus;
