import { mounts } from "@/hooks/use-mount";
import { Program } from "@/utils/create-root";

export default class SignalRoot {
  root?: Element;
  #program: Program;
  #id = 0;
  constructor(program: Program) {
    this.#program = program;
  }
  mount = (selector: string) => {
    const root = document.querySelector(selector);
    if (root) {
      this.root = root;
      root?.append(this.#program() as HTMLElement);
      for(const mount of mounts) mount();
    }
  }

  id = () => `id-${this.#id++}`;
}