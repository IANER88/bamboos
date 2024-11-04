import { Signal } from "@/signal";

type UseSignal<S> = S extends unknown[] ? Signal<S> : Omit<Signal<S>, 'map'>;

export default function useSignal<S>(initialState?: S) {
  const state = new Signal(initialState);
  const signal = {
    get value(){
      return state.value;
    },
    set value(value){
      state.value = value;
    },
    map: (fn) => state.map(fn),
  };
  return signal as UseSignal<S>;
}