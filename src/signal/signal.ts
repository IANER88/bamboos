import { RecrudescenceFn, getRecrudescence } from '@/hooks/use-recrudescence';
import { contents } from '@/utils/create-content';
import SignalContent from './signal-content';
import SignalDetermine from './signal-determine';
import { determines } from '@/utils/create-determine';
import SignalComponent from './signal-component';
import SignalTabulate from './signal-tabulate';
import { attributes } from '@/utils/create-attribute';
import SignalAttribute from './signal-attribute';
import { createTabulate } from '@/utils';
import SignalList from './signal-list';

export type Execute = {
  subscriber: SignalContent |
  SignalComponent |
  SignalDetermine |
  SignalTabulate |
  SignalAttribute |
  null;
};

type ISignal<S> = {
  value: S;
};

class Signal<S> implements ISignal<S> {

  value: S;

  #content: Set<Execute> = new Set();

  #attribute: Set<Execute> = new Set();

  #determine: Set<Execute> = new Set();

  #map: Set<Execute> = new Set();

  #recrudescence: Set<{
    rely: () => void;
    deps: Set<Set<RecrudescenceFn>>;
  }> = new Set();

  #subscribe = () => {
    const observers = [
      ...this.#attribute,
      ...this.#content,
      ...this.#map,
      ...this.#determine,
    ];
    for (const observer of observers) {
      if (observer.subscriber) {
        const contains = observer?.subscriber?.render?.();
        if (!contains) {
          if (observer.subscriber instanceof SignalAttribute)
            this.#attribute.delete(observer);
          // if (observer.subscriber instanceof SignalTabulate)
          //   this.#map.delete(observer);
          if (observer.subscriber instanceof SignalContent)
            this.#content.delete(observer)
          // if (observer.subscriber instanceof SignalDetermine) {
          //   this.#content.delete(observer)
          // }
        }
      };
    }
  }

  constructor(initialState: S) {

    const set = (target: this, key: 'value', value) => {
      if (!Object.is(target[key], value)) {
        target[key] = observer(value);
        for (const effect of [...this.#recrudescence]) {
          effect?.rely?.();
        }
        this.#subscribe();
      }
      return true;
    };

    const get = (target, key, receiver) => {
      const stack = getRecrudescence();
      const effect = stack.at(-1)
      if (effect) {
        this.#recrudescence.add(effect);
        effect.deps.add(this.#recrudescence);
      }
      const content = contents.at(-1);
      const determine = determines.at(-1);
      const attribute = attributes.at(-1);
      
      if (content) this.#content.add(content);
      if (determine) this.#determine.add(determine);
      if (attribute) this.#attribute.add(attribute);
      return Reflect.get(target, key, receiver)
    }

    const proxy = (signal) => {
      return new Proxy(signal, {
        set,
        get,
      });
    }
    const observer = (state) => {
      if (state instanceof Object && state) {
        if (state instanceof Array) {
          const signal: any = [];
          for (const soften of state) signal.push(observer(soften))
          return proxy(signal);
        };
        for (const value in state) {
          state[value] = observer(state[value]);
        }
        return proxy(state);
      }
      return state;
    }

    this.value = observer(initialState);
    const signal = proxy(this)

    return signal;
  }

  map = (fn: (item: S extends (infer U)[] ? U : S, index: number) => unknown) => {
    if (!(this.value instanceof Array)) throw Error('is not array type');
    const list = () => {
      return [...this.value as []].map(fn)
    };
    const observer = createTabulate(list);
    this.#map.add({ subscriber: observer });
    return observer.once() as unknown as Element;
  }
}

export default Signal;