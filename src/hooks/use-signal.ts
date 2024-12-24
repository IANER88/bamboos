import { recrudescence_stack, RecrudescenceFn } from "./use-recrudescence";
import { content_stack } from '@/utils/create-content';
import { determine_stack } from '@/utils/create-determine';
import { attribute_stack } from "@/utils/create-attribute";

export type Execute = {
  subscriber: () => Element | null;
}
type ISubscribe = {
  content: Set<Execute>;
  attribute: Set<Execute>;
  determine: Set<Execute>;
}

interface ISignal<S> {
  get value(): S;
  set value(value);
}

export default function useSignal<S>(initialState?: S): ISignal<S> {

  const state = {
    value: initialState,
  }

  const recrudescence: Set<{
    rely: () => void;
    deps: Set<Set<RecrudescenceFn>>;
  }> = new Set();

  const subscribe: ISubscribe = {
    content: new Set(),
    attribute: new Set(),
    determine: new Set(),
  }

  const on = {
    get: () => {
      const effect = recrudescence_stack.at(-1)
      if (effect) {
        recrudescence.add(effect);
        effect.deps.add(recrudescence);
      }
      const content = content_stack.at(-1);
      const determine = determine_stack.at(-1);
      const attribute = attribute_stack.at(-1);

      if (content) subscribe.content.add(content);
      if (determine) subscribe.determine.add(determine);
      if (attribute) subscribe.attribute.add(attribute);
    },
    set: () => {
      const observers = Object.values(subscribe).flatMap((item) => [...item]);
      for (const observer of observers) {
        if (observer.subscriber) {
          const contains = observer?.subscriber?.();
          // if (!contains) {
          //   if (observer.subscriber instanceof SignalAttribute)
          //     attribute.delete(observer);
          //   // if (observer.subscriber instanceof SignalTabulate)
          //   //   this.#map.delete(observer);
          //   if (observer.subscriber instanceof SignalContent)
          //     content.delete(observer)
          //   // if (observer.subscriber instanceof SignalDetermine) {
          //   //   this.#content.delete(observer)
          //   // }
          // }
        };
      }
    }
  }

  return {
    get value() {
      on.get();
      return state.value;
    },
    set value(value) {
      state.value = value;
      on.set();
    },
    // map: (fn) => state.map(fn),
  }
}