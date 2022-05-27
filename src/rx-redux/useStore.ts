import { useEffect, useState } from "react";
import { of, OperatorFunction } from "rxjs";
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
  _store: Store<T, A>,
  ob: OperatorFunction<T, R>
): R => {
  const [store, setStore] = useState<R>(() => {
    let val!: R;
    of(_store.value)
      .pipe(ob)
      .subscribe((data) => (val = data));
    return val;
  });

  useEffect(() => {
    const sub = _store.state.pipe(ob).subscribe(setStore);
    return () => sub.unsubscribe();
  }, [_store, ob]);

  return store;
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
  _store: Store<T, A>,
  path: P,
  ob: OperatorFunction<PathValue<T, P>, R>
): R => {
  const [store, setStore] = useState<R>(() => {
    let val!: R;
    of(get(_store.value, path))
      .pipe(ob)
      .subscribe((data) => (val = data));
    return val;
  });

  useEffect(() => {
    const sub = _store.select(path).pipe(ob).subscribe(setStore);
    return () => sub.unsubscribe();
  }, [_store, path, ob]);

  return store;
};
