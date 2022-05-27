import { scan } from "rxjs";

export type ReducerFn<T, A> = (state: T, action: A) => T;

export const reducer = <T, A>(fn: ReducerFn<T, A>) => scan<any, T>(fn);
