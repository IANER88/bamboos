import SignalAttribute from "@/signal/signal-attribute";

type Attribute = {
  subscriber: null | SignalAttribute
}

export const attribute_stack: Attribute[] = [];

export default function createAttribute(attribute) {

  const execute = () => {
    attribute_stack.push(executes);
    try {
      attribute()
      const subscriber = new SignalAttribute(attribute);
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