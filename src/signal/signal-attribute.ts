import createEvent from "@/utils/create-event";
import SignalReference from "./signal-reference";
import { root_stack } from "@/utils/create-root";

export default class SignalAttribute {

  #root: HTMLElement | HTMLInputElement;

  #value: () => unknown;

  #attribute: string;

  render?: () => void;

  constructor(value) {
    this.#value = value;
    this.#root = null as any;
    this.#attribute = ''
  }

  #contains = () => {
    const root = root_stack.at(-1);
    const element = root?.root?.contains(this.#root as Element);
    return element;
  }

  // change = (root: HTMLElement, attribute) => {
  //   this.#attribute = attribute;
  //   this.#root = root;
  //   if (this.#root) {
  //     const regex = /^on:(.*)/;
  //     if (regex.test(this.#attribute)) {
  //       createEvent({
  //         element: this.#root,
  //         event: this.#attribute.replace(':', ''),
  //         func: this.#value() as () => void,
  //       })
  //     } else {
  //       const value = this.#value();
  //       switch (this.#attribute) {
  //         case 'use:key':
  //           this.render = () => {
  //             this.#root.dataset.key = this.#value() as string;
  //             return this.#contains();
  //           };
  //           break;
  //         case 'use:reference':
  //           if (value instanceof SignalReference) {
  //             value.reference = this.#root
  //           }
  //           break;
  //         case 'use:html':
  //           this.render = () => {
  //             this.#root.innerHTML = this.#value() as string;
  //             return this.#contains();
  //           }
  //           break;
  //         case 'use:text':
  //           this.render = () => {
  //             this.#root.innerText = this.#value() as string;
  //             return this.#contains();
  //           }
  //           break;
  //         case 'value':
  //           this.render = () => {
  //             if (this.#root instanceof HTMLInputElement) {
  //               this.#root.value = this.#value() as string;
  //               this.#root.setAttribute(this.#attribute, this.#value() as string);
  //               return this.#contains();
  //             }
  //           }

  //           break;
  //         case 'style':
  //           this.render = () => {
  //             const value = this.#value();
  //             this.#root.setAttribute(
  //               this.#attribute,
  //               Object.keys(value as {}).map((key) => `${key}:${(value as {})[key]}`).join(';')
  //             )
  //             return this.#contains();
  //           }
  //           break;
  //         default:
  //           this.render = () => {
  //             this.#root.setAttribute(this.#attribute, this.#value() as string)
  //             return this.#contains();
  //           };

  //       }
  //     }
  //     this.render?.();
  //   }
  // }

  get change(){
    console.log(this);
    return 
  }
}