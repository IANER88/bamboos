import SignalAttribute from "@/signal/signal-attribute";

type Attribute = {
  subscriber: null | SignalAttribute
}

export const attribute_stack: Attribute[] = [];

type I_ATTRIBUTE = HTMLElement | HTMLInputElement;

type IStack = [string, () => unknown];
export default function createAttribute(
  this: I_ATTRIBUTE,
  stack: IStack,
) {

  const [name, attribute] = stack

  const create = () => {
    switch (name) {
      case 'value':
        if (this instanceof HTMLInputElement) this.value = attribute();
        break;
      case 'use:key':
        this.dataset.key = attribute();
        break;
      case 'style':
        const value = attribute();
        this.setAttribute(
          name,
          Object.keys(value).map((key) => `${key}:${(value as {})[key]}`).join(';')
        )
    }
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