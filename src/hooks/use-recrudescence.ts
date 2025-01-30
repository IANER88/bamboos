export type Recrudescence = () => void;

export type RecrudescenceFn = {
  subscriber(): void;
  deps: Set<Set<RecrudescenceFn>>
}

export const recrudescence_stack: RecrudescenceFn[] = [];

/**
 * @function useRecrudescence 復發
 * @param recrudescence 
*/

export default  function useRecrudescence(recrudescence: Recrudescence) {
  const subscriber = () => {
    for (const dep of effect.deps) {
      dep.delete(effect);
    }
    effect.deps.clear();
    recrudescence_stack.push(effect);
    try {
      recrudescence();
    } finally {
      recrudescence_stack.pop();
    }
  }

  const effect: RecrudescenceFn = {
    deps: new Set(),
    subscriber,
  }
  subscriber();
}