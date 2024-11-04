import SignalDetermine from "@/signal/signal-determine";
import { JSX } from "@/types/jsx-runtime";

type Determines = {
  subscriber: null | SignalDetermine;
}

export const determines: Determines[] = [];

type Condition = () => JSX.Element;

export default function createDetermine(condition: Condition) {

  const execute = () => {
    determines.push(executes);
    try {
      condition();
      const subscriber = new SignalDetermine(condition);
      executes.subscriber = subscriber;
      return subscriber.once();
    } finally {
      determines.pop();
    }
  }

  const executes: Determines = {
    subscriber: null,
  }

  return execute();
}