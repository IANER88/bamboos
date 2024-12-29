import {RecrudescenceFn} from "@/hooks/use-recrudescence";
import {content_stack} from "@/utils/create-content";
import {expression_stack} from "@/utils/create-expression";
import {list_stack} from "@/utils/create-list";


export type Execute = {
  subscriber: () => Element | null;
}

interface ISignal<S> {
  value: S;
};


const create = (initialState) => {

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
          create(state[key])
        ]
      )
    );
  }

  return createSignal(state)
}

const createSignal = (initialState) => {

  const observes = {
    content: new Set(),
    list: new Set(),
    expression: new Set(),
  }

  const createGet = () => {
    const content = content_stack.at(-1);
    const list = list_stack.at(-1);
    const expression = expression_stack.at(-1);

    if (content) observes.content.add(content);
    if (list) observes.list.add(list);
    if (expression) observes.expression.add(expression)
  }

  const createSet = () => {
    const subscribes = [
      ...observes.content,
      ...observes.list,
      ...observes.expression
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
      create(initialState) :
      initialState,
  };

  return createSignal(signal);
}