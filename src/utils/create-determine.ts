import SignalDetermine from "@/signal/signal-determine";
import { JSX } from "@/types/jsx-runtime";

type Determines = {
  subscriber: null | SignalDetermine;
}

export const determine_stack: Determines[] = [];

type Condition = () => JSX.Element;

export default function createDetermine(condition: Condition) {

  const execute = () => {
    determine_stack.push(executes);
    try {
      condition();
      const subscriber = new SignalDetermine(condition);
      executes.subscriber = subscriber;
      return subscriber.once();
    } finally {
      determine_stack.pop();
    }
  }

  const executes: Determines = {
    subscriber: null,
  }

  return execute();
}