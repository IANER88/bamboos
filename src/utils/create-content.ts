type Execute = {
  subscriber: () => null | Element | void;
}

export const content_stack: Execute[] = [];

type i_content = null | number | false | string | [];

export default function createContent(content: string | number | []) {
  let root: HTMLElement | null = null;
  let latest = null;

  let oldest = null;

  const ask = () => {
    latest = content;
    return latest;
  }

  const test = (content) => {
    oldest = latest;
    const node = [null, void 0, false].includes(content);
    if (node) return document.createComment('content');
    if (content instanceof Array) {
      return content.map(test);
    }
    return document.createTextNode(content);
  }


  return () => {
    const latest = ask();
    if (root === null) {
      root = test(latest);
      return root;
    }
    ;
    if (!Object.is(oldest, latest)) {
      // const element = this.#contains();
      const node = test(latest);
      root?.replaceWith(node)
      root = node as any;
      // return element;
    }
  }
}