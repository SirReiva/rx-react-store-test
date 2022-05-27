//@ts-ignore
import _get from "lodash.get";
//@ts-ignore
import _isEqual from "lodash.isequal";
import { distinctUntilChanged, map, pipe } from "rxjs";

type PathImpl<T, Key extends keyof T> = Key extends string
  ? T[Key] extends Record<string, any>
    ?
        | `${Key}.${PathImpl<T[Key], Exclude<keyof T[Key], keyof any[]>> &
            string}`
        | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
    : never
  : never;

type PathImpl2<T> = PathImpl<T, keyof T> | keyof T;

export type Path<T> = PathImpl2<T> extends string | keyof T
  ? PathImpl2<T>
  : keyof T;

export type PathValue<
  T,
  P extends Path<T>
> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Rest extends Path<T[Key]>
      ? PathValue<T[Key], Rest>
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never;

export function get<T, P extends Path<T>>(obj: T, path: P): PathValue<T, P> {
  return _get(obj, path);
}

export const select = <T, P extends Path<T>>(path: P) =>
  pipe(
    map<T, PathValue<T, P>>((state) => get(state, path)),
    distinctUntilChanged(_isEqual)
  );
