type Attribute = {
  subscriber: null | (() => unknown)
}

export const attribute_stack: Attribute[] = [];

type I_ATTRIBUTE = HTMLElement | HTMLInputElement;

type IStack = [string, () => () => unknown];
export default function createAttribute(
  this: I_ATTRIBUTE,
  stack: IStack,
) {

  const [name, attribute] = stack

  const create = () => {
    const on = /on:(.*)/;
    if (on.test(name)) {
      const [, event] = name.split(':');
      const title = event.split('-').join('');
      this.addEventListener(title, attribute());
      return;
    }
    const use = /use:(.*)/;
    if (use.test(name)) {
      const [, title] = name.split(':');
      switch (title) {
        case 'key':
          this.dataset.key = attribute();
          break;
      }
    }
//    switch (name) {
//      case 'value':
//        if (this instanceof HTMLInputElement) this.value = attribute();
//        break;
//      case 'use:key':
//        this.dataset.key = attribute();
//        break;
//      case 'style':
//        const value = attribute();
//        this.setAttribute(
//          name,
//          Object.keys(value).map((key) => `${key}:${(value as {})[key]}`).join(';')
//        )
//    }
  };

  const execute = () => {
    create();
    attribute_stack.push(executes);
    try {
      attribute()
      const subscriber = create;
      executes.subscriber = subscriber;
      return subscriber
    } finally {
      attribute_stack.pop();
    }
  }

  const executes: Attribute = {
    subscriber: null,
  }

  return execute();
}