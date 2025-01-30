
import { content_stack } from "@/utils/create-content";
import { expression_stack } from "@/utils/create-expression";
import { list_stack } from "@/utils/create-list";
import { recrudescence_stack } from "./use-recrudescence";
import { determine_stack } from "@/utils/create-determine";


export type Execute = {
  subscriber: () => Element | null;
}

interface ISignal<S> {
  value: S;
};


const readSignal = <S>(initialState?: S) => {

  let state = initialState;

  if (
    initialState === null ||
    typeof initialState !== 'object'
  ) {
    return initialState;
  }

  if (initialState instanceof Array) {
    state = state.map(create);
  } else {
    state = Object.fromEntries(
      Object.keys(state).map(
        (key) => [
          key,
          readSignal(state[key])
        ]
      )
    );
  }

  return createSignal(state)
}

const createSignal = <S>(initialState?: S) => {

  const observes = {
    content: new Set(),
    list: new Set(),
    expression: new Set(),
    determine: new Set(),
    recrudescence: new Set(),
  }

  const createGet = () => {
    const content = content_stack.at(-1);
    const list = list_stack.at(-1);
    const expression = expression_stack.at(-1);
    const recrudescence = recrudescence_stack.at(-1);
    const determine = determine_stack.at(-1);
  

    if (content) observes.content.add(content);
    if (list) observes.list.add(list);
    if (expression) observes.expression.add(expression);
    if (recrudescence) observes.recrudescence.add(recrudescence);
    if (determine) observes.determine.add(determine);
  }

  const createSet = () => {
    const subscribes = [
      ...observes.content,
      ...observes.list,
      ...observes.expression,
      ...observes.determine,
      ...observes.recrudescence,
    ]
    for (const subscribe of subscribes) {
      subscribe.subscriber()
    }
  }

  return new Proxy(initialState, {
    get(target, key) {
      createGet();
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
      createSet();
      return true;
    }
  });
}

/** 信號 **/
export default function useSignal<S>(initialState?: S): ISignal<S> {

  const signal = {
    value: typeof initialState === 'object' &&
      initialState !== null ?
      readSignal(initialState) :
      initialState,
  };

  return createSignal(signal);
}