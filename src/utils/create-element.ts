import type { Execute } from "@/signal";

export const observers: Execute[] = [];

export type Component = [
  tag: string,
  attribute: {},
  children: [],
];

export default function createElement(tag: string, attribute, ...children) {

  const execute = () => {
    const element = document.createElement(tag);
    const attr = Object.keys(attribute ?? {});

    if (attr?.length) {
      const on = /^on:(.*)/;
      for (const key of Object.keys(attribute)) {
        if (on.test(key)) {
          attribute[key]?.apply?.(element);
        }
        if (typeof attribute[key] === 'function'){
          attribute[key]
        }else{
          element.setAttribute(key, attribute[key])
        }
      }
    }
    if (children.length) {
      const content = children.flat();
      element.append(...content)
    }
    return element;
  }
  return execute();
}