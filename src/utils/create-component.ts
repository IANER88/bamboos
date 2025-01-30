import { JSX } from "@/types/jsx-runtime";
import { Reference } from "@/hooks/use-reference";
import { ReadDisentangle, disentangle_stack } from "@/seeders/on-disentangle";
import { ReadMount, mount_stack } from "@/seeders/on-mount";


export type Executes = { subscriber: null }

type Component = (props: {}, reference: Reference | void) => JSX.Element;

type Props = {
  ['use:reference']?: Reference;
  ['use:key']?: number | string;
}
export const components: Executes[] = [];

type ICycles = {
  mount: ReadMount | undefined | null;
  disentangle: Set<ReadDisentangle | unknown>;
}

export const component_stack: ICycles[] = [];
export default function createComponent(component: Component, props: Props, ...children) {

  const {
    ['use:reference']: reference,
    ['use:key']: key,
    ...rest
  } = props ?? {};

  const execute = () => {
    component_stack.push(cycle);
    try {
      const disentangle = disentangle_stack.at(-1);
      if (disentangle) cycle.disentangle.add(disentangle);
      
      return component({
        ...rest,
        children
      }, reference);

    } finally {

    }
  }

  const cycle = {
    mount: null,
    disentangle: new Set(),
  }
  return execute();
}