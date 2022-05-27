import { filter, map, pipe } from "rxjs";
import "./App.css";
import { Store } from "./rx-redux/store";
import { useSelectStore, useSelectTransformStore } from "./rx-redux/useStore";

type Actions =
  | {
      type: "ADD1";
    }
  | {
      type: "MINUS1";
    }
  | {
      type: "ADD2";
    }
  | {
      type: "MINUS2";
    };

const store = new Store(
  {
    count: 0,
    count2: 0,
    test: {
      a: 5,
      b: true,
    },
  },
  (val, action: Actions) => {
    if (action.type === "ADD1")
      return {
        ...val,
        count: val.count + 1,
      };
    if (action.type === "MINUS1")
      return {
        ...val,
        count: val.count - 1,
      };
    if (action.type === "ADD2")
      return {
        ...val,
        count2: val.count2 + 1,
      };
    if (action.type === "MINUS2")
      return {
        ...val,
        count2: val.count2 - 1,
      };
    return val;
  }
);

const Count1 = () => {
  const count = useSelectTransformStore(
    store,
    "count",
    pipe(
      filter((val) => val % 2 === 0),
      map((val) => `Josyto ${val}`)
    )
  );

  console.log("Count1");
  return (
    <>
      {count}
      <button type="button" onClick={() => store.dispatch({ type: "ADD1" })}>
        + 1
      </button>
      <button type="button" onClick={() => store.dispatch({ type: "MINUS1" })}>
        - 1
      </button>
    </>
  );
};

const Count2 = () => {
  const count = useSelectStore(store, "count2");
  console.log("Count2");
  return (
    <>
      {count}
      <button type="button" onClick={() => store.dispatch({ type: "ADD2" })}>
        + 1
      </button>
      <button type="button" onClick={() => store.dispatch({ type: "MINUS2" })}>
        - 1
      </button>
    </>
  );
};

function App() {
  return (
    <div className="App">
      <Count1 />
      <Count2 />
    </div>
  );
}

export default App;
