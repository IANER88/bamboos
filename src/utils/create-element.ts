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
      for (const key of Object.keys(attribute)) {
        const view = attribute[key]
        view.once(element, key);
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