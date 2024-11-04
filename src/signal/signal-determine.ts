import { Disentangle, disentangles } from "@/hooks/use-disentangle";
import SignalTabulate from "./signal-tabulate";
import { JSX } from "@/types/jsx-runtime";
import createComponent, { cycles } from "@/utils/create-component";
import { Mount } from "@/hooks/use-mount";

type Root = Element[] | Element | Comment | JSX.ArrayElement | Text;


class SignalDetermine {

  #root?: Root;

  #view: () => ReturnType<typeof createComponent>;

  #disentangles: Set<Disentangle> = new Set();

  #mounts: Set<Mount> = new Set();

  #test = () => {
    const node = [void 0, null, false];
    const text = ['string', 'number'];
    const root = this.#view();
    if (node.includes(root as unknown as null)) {
      return document.createComment('determine');
    }
    const cycle = cycles.at(-1)
    for(const disentangle of cycle?.disentangles ?? []){
      this.#disentangles.add(disentangle);
    }
    for(const mount of cycle?.mounts ?? []) {
      this.#mounts.add(mount);
    }
    if (text.includes(typeof root)) document.createTextNode(root);

    return root;
  }

  constructor(view) {
    this.#view = view;
  }

  // #contains = (node) => {
  //   const root = roots.at(-1);
  //   const element = root?.contains(node as Element);
  //   return element;
  // }

  once = () => {
    const node = this.#test();
    this.#root = node as any;
    console.log(node);
    
    return node;
  }

  render = () => {
    const node = this.#test();   
    
    const fragment = node instanceof Array ? node : [node];
    if (this.#root instanceof Array) {
      const app: any = this.#root.at(-1);
      for (const view of this.#root.slice(0, -1)) {
        (view as Element).remove();
      }
      app.replaceWith(...fragment as []);
      this.#root = fragment as any;
    } else {      
      (this.#root as Element).replaceWith(...fragment as []);
      this.#root = node as any;
    }
    for(const disentangle of this.#disentangles){
      disentangle();
    }
    this.#disentangles.clear();
  }
}

export default SignalDetermine;