import SignalComponent from "@/signal/signal-component";
import { JSX } from "@/types/jsx-runtime";
import { Reference } from "@/hooks/use-reference";
import { Disentangle, disentangles } from "@/hooks/use-disentangle";
import { Mount, mounts } from "@/hooks/use-mount";


export type Executes = { subscriber: SignalComponent | null }

type Component = (props: {}, reference: Reference | void) => JSX.Element;

type Props = {
  ['use:reference']?: Reference;
  ['use:key']?: number | string;
}
export const components: Executes[] = [];

type ICycles = {
  mounts: Set<Mount | unknown>;
  disentangles: Set<Disentangle | unknown>;
}

export const cycles: ICycles[] = [];
export default function createComponent(component: Component, props: Props, ...children) {

  const {
    ['use:reference']: reference,
    ['use:key']: key,
    ...rest
  } = props ?? {};

  const execute = () => {
    cycles.push(cycle);
    try {
      const disentangle = disentangles.at(-1);
      const mount = mounts.at(-1);
      if (disentangle) cycle.disentangles.add(disentangle);
      if (mount) cycle.mounts.add(mount);
      return component(props, reference);
    } finally {
      cycles.pop();
    }
  }
  
  const cycle = {
    mounts: new Set(),
    disentangles: new Set(),
  }  
  return execute();
}