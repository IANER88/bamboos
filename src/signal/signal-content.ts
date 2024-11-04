import { roots } from "@/utils/create-root";

export default class SignalContent {

  #root?: Comment | Element;

  #latest?: null | number | false | string;

  #oldest?: null | number | false | string;

  #test = (content) => {
    this.#oldest = this.#latest;
    const node = [null, void 0, false].includes(content);
    if (node) return document.createComment('content');
    if (content instanceof Array) {
      return content.map(this.#test);
    }
    return document.createTextNode(content);
  }

  #content: () => false | null | string | number | void | unknown[];
  constructor(content) {
    this.#content = () => {
      this.#latest = content();
      return this.#latest;
    };
  }

  once = () => {
    const node = this.#test(this.#content());
    this.#root = node as any;
    return this.#root;
  }

  #contains = () => {
    const root = roots.at(-1);
    const element = root?.root?.contains(this.#root as Element);
    return element;
  }

  render = () => {
    const latest = this.#content();
    if (!Object.is(this.#oldest, latest)) {
      const element = this.#contains();
      const node = this.#test(latest);
      this.#root?.replaceWith(node)
      this.#root = node as any;
      return element;
    }
    return this.#contains();
  }
}