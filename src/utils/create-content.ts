type Execute = {
  subscriber: () => null | Element | void;
}

export const content_stack: Execute[] = [];

type State = {
  root: HTMLElement | null;
  latest: null | string;
  oldest: null | string;
}

export default function createContent(content: string | number | []) {

  const state: State = {
    root: null,
    latest: null,
    oldest: null,
  }

  const ask = () => {
    state.latest = content;
    return state.latest;
  }

  const test = (content) => {
    state.oldest = state.latest;
    const node = [null, void 0, false].includes(content);
    if (node) return document.createComment('content');
    if (content instanceof Array) {
      return content.map(test);
    }
    return document.createTextNode(content);
  }


  return () => {
    const latest = ask();
    if (state.root === null) {
      state.root = test(latest);
      return state.root;
    }

    if (!Object.is(state.oldest, latest)) {
      // const element = this.#contains();
      const node = test(latest);
      state.root?.replaceWith(node)
      state.root = node as any;
      // return element;
    }
  }
}