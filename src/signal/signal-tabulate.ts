import { roots } from '@/utils/create-root';
import lodash from 'lodash';

export default class SignalTabulate {

  #tabulate = () => HTMLElement;

  #oldest: HTMLElement[] = [];

  #latest: HTMLElement[] = [];

  #generate = (latest) => {
    return latest?.map?.((item) => ({ key: item?.dataset?.key }))
  }

  #contains = (node) => {
    const root = roots.at(-1);
    const element = root?.root?.contains(node);
    return element;
  }

  constructor(tabulate) {
    this.#tabulate = () => {
      const latest = tabulate();
      this.#latest = latest;
      return latest;
    }
  }

  #test = () => {
    const tabulates = this.#tabulate?.();
    if (tabulates.length) {
      return tabulates;
    }
    return document.createComment('tabulate');
  }

  once = () => {
    const node = this.#test();
    this.#latest = node as any;
    this.#oldest = this.#latest;
    return node;
  }

  #remove = () => {
    const [latest, oldest] = [this.#latest, this.#oldest].map(this.#generate);
    const diff = lodash.differenceBy(oldest, latest, 'key');
    if (diff.length) {
      const [old] = diff ?? []
      const previous = oldest.findIndex((item) => item.key === old.key);
      this.#oldest[previous].remove();
      this.#oldest.splice(previous, diff.length);
    }
  }

  #add = () => {
    const [oldest, latest] = [this.#oldest, this.#latest].map(this.#generate);
    const diff = lodash.differenceBy(latest, oldest, 'key');

    if (diff.length) {
      const [old] = diff ?? []
      const previous = latest.findIndex((item) => item.key === old.key);
      if (previous === 0) {
        const next = this.#latest.at(previous);
        if (next) {
          this.#oldest[previous].insertAdjacentElement('beforebegin', next);
          this.#oldest.splice(previous, 0, next);
        }
        return;
      }
      const next = this.#latest.at(previous);
      if (next) {
        this.#oldest[previous - 1].insertAdjacentElement('afterend', next);
        this.#oldest.splice(previous, 0, next);
      }
    }
  }

  render = () => {
    const comment = this.#test();  
        // const some = this.#oldest.some(this.#contains);  
    if (this.#oldest instanceof Comment) {
      if (!this.#latest.length) return true;
      this.#oldest.replaceWith(...this.#latest);
      this.#oldest = this.#latest;
      // return some;
    }
    if (!this.#latest.length) {
      const diff = this.#oldest.slice(1, this.#oldest.length);
      for (const node of diff) {
        node.remove();
      }
      this.#oldest.at(0)?.replaceWith(comment as unknown as Comment);
      this.#oldest = comment as any
      // return some;
    }
    this.#add();
    this.#remove();
    // return some;
  }
}