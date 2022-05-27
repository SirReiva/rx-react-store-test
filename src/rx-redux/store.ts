import {
  Observable,
  share,
  skip,
  startWith,
  Subject,
  Subscription,
} from "rxjs";
import { reducer, ReducerFn } from "./reducer";
import { Path, select } from "./select";

export class Store<T, A> {
  state: Observable<T>;

  private actions: Subject<A> = new Subject();

  value: T;

  private sub: Subscription;

  constructor(initialVal: T, fn: ReducerFn<T, A>) {
    this.value = initialVal;
    this.state = this.actions.pipe(
      startWith(initialVal),
      reducer(fn),
      skip(1),
      share()
    );
    this.sub = this.state.subscribe((val) => {
      this.value = val;
    });
  }

  select<P extends Path<T>>(path: P) {
    if (this.sub.closed) throw new Error("Store Destroyed");
    return this.state.pipe(startWith(this.value), select<T, P>(path), skip(1));
  }

  dispatch(action: A) {
    if (this.sub.closed) throw new Error("Store Destroyed");
    this.actions.next(action);
  }

  destroy() {
    this.sub.unsubscribe();
    this.actions.complete();
  }
}

// const OfType = <T, A>(store: Store<T, A>) => {}
