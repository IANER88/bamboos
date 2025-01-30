type Attribute = {
  subscriber: null | (() => unknown)
}

type OTHER = () => unknown;

type ON =  (() => () => unknown);

export const attribute_stack: Attribute[] = [];

type EI = HTMLElement | HTMLInputElement;

type IStack = [string, ON | OTHER];


export default function createAttribute(
  this: EI,
  stack: IStack,
) {

  const [name, attribute] = stack

  const readAttribute = () => {
    const on = /on:(.*)/;
    if (on.test(name)) {
      const [, event] = name.split(':');
      const title = event.split('-').join('');
      this.addEventListener(title, attribute() as ON);
      return;
    }
    const use = /use:(.*)/;
    if (use.test(name)) {
      const [, title] = name.split(':');
      switch (title) {
        case 'key': {
          const content = attribute() as string;
          if (['number', 'string'].includes(typeof content)) {
            this.dataset.key = content;
            return;
          }
          throw `The value of key cannot be a ${typeof content}`
        }
        case 'value': {
          if (this instanceof HTMLInputElement) this.value = attribute();
        }
      }
    }
  };

  const execute = () => {
    attribute_stack.push(executes);
    try {
      attribute()
      executes.subscriber = readAttribute;
      return executes.subscriber();
    } finally {
      attribute_stack.pop();
    }
  }

  const executes: Attribute = {
    subscriber: null,
  }

  return execute();
}