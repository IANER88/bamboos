
import { readMount } from "@/read";
import { mount_stack } from "@/seeders/on-mount";
import { JSX } from "@/types/jsx-runtime";

export type Program = () => HTMLElement | JSX.Element;

export const root_stack: [] = [];

export default function createRoot(program: Program) {

  class Root {
    #root: Program;

    #select: Element | null;

    constructor(root: Program){
      this.#root = root;
    }

    mount = (selector: string) => {
      const select = document.querySelector(selector);
      if (select) {
        this.#select = select;
        this.#select?.append(this.#root() as HTMLElement);
        readMount()
      }
    }
  }

  const root = new Root(program);

  return root;
}