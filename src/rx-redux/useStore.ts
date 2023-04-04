import { DependencyList, useEffect, useMemo, useRef, useState } from "react";
import { catchError, of, OperatorFunction } from "rxjs";
import { get, Path, PathValue } from "./select";
import { Store } from "./store";

export const useStore = <T, A>(_store: Store<T, A>): T => {
  const [store, setStore] = useState<T>(() => _store.value);

  useEffect(() => {
    const sub = _store.state.subscribe(setStore);
    return () => sub.unsubscribe();
  }, [_store]);

  return store;
};

export const useStoreTransform = <T, A, R>(
  store: Store<T, A>,
  ob: OperatorFunction<T, R>
): R | undefined => {
  const [val, setVal] = useState<R | undefined>(undefined);

  useEffect(() => {
    const sub = store.stateWithValue().pipe(ob).subscribe(setVal);
    return () => sub.unsubscribe();
  }, [store, ob]);

  return val;
};

export const useSelectStore = <T, A, P extends Path<T>, R>(
  _store: Store<T, A>,
  path: P
): PathValue<T, P> => {
  const [store, setStore] = useState(() => get(_store.value, path));

  useEffect(() => {
    const sub = _store.select(path).subscribe(setStore);
    return () => sub.unsubscribe();
  }, [_store, path]);

  return store;
};

export const useSelectTransformStore = <T, A, P extends Path<T>, R>(
  store: Store<T, A>,
  path: P,
  ob: OperatorFunction<PathValue<T, P>, R>
): R | undefined => {
  const [val, setVal] = useState<R | undefined>(undefined);

  useEffect(() => {
    const sub = store.selectWithValue(path).pipe(ob).subscribe(setVal);
    return () => sub.unsubscribe();
  }, [store, path, ob]);

  return val;
};

export const usePipe = <R, T>(
  pipe: OperatorFunction<R, T>
): OperatorFunction<R, T> => {
  const refPipe = useRef(pipe);
  return refPipe.current;
};

export const usePipeWithDeps = <R, T>(
  pipe: OperatorFunction<R, T>,
  deps: DependencyList = []
): OperatorFunction<R, T> => {
  const refPipe = useMemo(() => pipe, deps);
  return refPipe;
};
