export interface IObserver<T = any>{
	observerUpdate(value: T, obsreverId: number): void;
}