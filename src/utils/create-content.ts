type Execute = {
  subscriber: () => null | Element | void;
}

export const content_stack: Execute[] = [];

type State = {
  root: HTMLElement | null;
  latest: null | ReturnType<Content>;
  oldest: null | ReturnType<Content>;
}

type Content = () => string | number | void | boolean | null | [];

/**/
export default function createContent(content: Content) {

  const state: State = {
    root: null,
    latest: null,
    oldest: null,
  }

  const test = (content: ReturnType<Content>) => {
    state.oldest = state.latest;
    const node = [null, void 0, false].includes(content);
    if (node) return document.createComment('content');
    if (content instanceof Array) {
      return content.map(test);
    }
    return document.createTextNode(content);
  }

  const onchange = () => {
    state.latest = content();
    if (state.root === null) {
      state.root = test(state.latest);
      return state.root;
    }

    if (!Object.is(state.oldest, state.latest)) {
      // const element = this.#contains();
      const node = test(state.latest);
      state.root?.replaceWith(node)
      state.root = node as any;
      // return element;
    }
  }

  return onchange;
}