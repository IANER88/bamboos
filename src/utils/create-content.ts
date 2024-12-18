type Execute = {
  subscriber: () => null | Element | void;
}

export const content_stack: Execute[] = [];

type IContent = null | number | false | string | [];

export default function createContent(content: () => string | number | []) {

  const render = () => {
    let root: HTMLElement | null = null;
    let latest: IContent = null;

    let oldest: IContent = null;

    const ask = () => {
      latest = content();
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
      };
      if (!Object.is(oldest, latest)) {
        // const element = this.#contains();
        const node = test(latest);
        root?.replaceWith(node)
        root = node as any;
        // return element;
      }
    }
  }

  const execute = () => {
    content_stack.push(executes);
    try {
      const node = content();
      if (Array.isArray(node)) {
        content_stack.pop();
        return node;
      }
      const subscriber = render();

      executes.subscriber = subscriber;

      return subscriber();
    } finally {
      content_stack.pop();
    }
  }

  const executes: Execute = {
    subscriber: () => null,
  }

  return execute();
}