import {differenceBy} from 'lodash'

export default function createList(tabulate) {
  let oldest = []; // 存儲舊節點
  let latest = []; // 存儲新節點

  // 創建新節點
  const create = () => {
    latest = tabulate();
    return latest;
  }
  //比對節點
  const test = () => {
    const list = create();
    if (list.length) {
      return list;
    }
    return document.createComment('tabulate');
  }

  const remove = () => {
    const transformation = [latest, oldest].map(generate)
    const diff = differenceBy(...transformation, 'key');
    if (diff.length) {
      const [, _oldest] = transformation;
      const [old] = diff ?? [];
      const previous = _oldest.findIndex(item => item.key === old.key);
      oldest[previous].remove();
      oldest.splice(previous, diff.length)
    }
  }
  const add = () => {
    const transformation = [oldest, latest].map(generate);
    const diff = lodash.differenceBy(...transformation, 'key');

    if (diff.length) {
      const [old] = diff ?? [];
      const [, _latest] = transformation;
      const previous = latest.findIndex((item) => item.key === old.key);
      if (previous === 0) {
        const next = latest.at(previous);
        if (next) {
          oldest[previous].insertAdjacentElement('beforebegin', next);
          oldest.splice(previous, 0, next);
        }
        return;
      }
      const next = latest.at(previous);
      if (next) {
        oldest[previous - 1].insertAdjacentElement('afterend', next);
        oldest.splice(previous, 0, next);
      }
    }
  }

  const generate = (latest) => {
    return latest?.map?.(item => ({
      key: item?.dataset?.key
    }))
  }

  return () => {
    const comment = test();
    // const some = this.#oldest.some(this.#contains);
    if (oldest instanceof Comment) {
      if (!latest.length) return true;
      oldest.replaceWith(...latest);
      oldest = latest;
      // return some;
    }
    if (!latest.length) {
      const diff = oldest.slice(1, oldest.length);
      for (const node of diff) {
        node.remove();
      }
      oldest.at(0)?.replaceWith(comment as unknown as Comment);
      oldest = comment as any
      // return some;
    }
    add();
    remove();
  }
}
