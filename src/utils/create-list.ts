import {differenceBy} from 'lodash'


export const list_stack: [] = [];

type List = () => HTMLElement[];
type State = {
  oldest: ReturnType<List> | Comment;
  latest: ReturnType<List> | Comment;
}
export default function createList(list: List) {

  const state: State = {
    // 存儲舊節點
    oldest: [],
    // 存儲新節點
    latest: [],
  };

  let once = true;

  // 創建新節點
  const create = () => {
    state.latest = list();
    return state.latest;
  }
  //比對節點
  const test = () => {
    const list = create();
    if (list.length) {
      return list;
    }
    return document.createComment('list');
  }

  /*刪除*/
  const remove = () => {
    const [latest, oldest] = [state.latest, state.oldest].map(generate);
    const diff = differenceBy(oldest, latest, 'key');
    if (diff.length) {
      const [old] = diff ?? []
      const previous = oldest.findIndex((item) => item.key === old.key);
      state.oldest?.[previous]?.remove?.();
      state.oldest.splice(previous, diff.length);
    }
  }

  /*添加*/
  const add = () => {
    const [oldest, latest] = [state.oldest, state.latest].map(generate);
    const diff = differenceBy(latest, oldest, 'key');

    if (diff.length) {
      const [old] = diff ?? []
      const previous = latest.findIndex((item) => item.key === old.key);
      if (previous === 0) {
        const next = state.latest.at(previous);
        if (next) {
          state.oldest?.[previous]?.insertAdjacentElement?.('beforebegin', next);
          state.oldest.splice(previous, 0, next);
        }
        return;
      }
      const next = state.latest.at(previous);
      if (next) {
        state.oldest[previous - 1].insertAdjacentElement?.('afterend', next);
        state.oldest.splice(previous, 0, next);
      }
    }

  }

  const generate = (latest) => {
    return latest?.map?.(item => ({
      key: item?.dataset?.key
    }))
  }

  /*綁定改變*/
  const onchange = () => {
    const comment = test();
    // const some = this.#oldest.some(this.#contains);
    if (state.oldest instanceof Comment) {
      if (!state.latest.length) return true;
      state.oldest.replaceWith(...state.latest);
      state.oldest = state.latest;
      // return some;
    }
    if (!state.latest.length) {
      const diff = state.oldest.slice(1, state.oldest.length);
      for (const node of diff) {
        node.remove();
      }
      state.oldest.at(0)?.replaceWith(comment as unknown as Comment);
      state.oldest = comment as any

      // return some;
    }
    if (once) {
      state.latest = test();
      state.oldest = state.latest;
      once = false;
      return state.latest;
    } else {
      add();
      remove();
    }
  }


  return onchange;
}
