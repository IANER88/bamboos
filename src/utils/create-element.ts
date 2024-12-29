export const observers = [];

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
        if (typeof attribute[key] === 'function') {
          attribute[key]?.apply?.(element);
        } else {
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