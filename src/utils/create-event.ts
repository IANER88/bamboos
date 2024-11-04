type Options = {
  event: string;
  func: () => void;
  element: Element;
}

export default function createEvent(options: Options) {
  const {
    event,
    func,
    element,
  } = options;
  element[event] = func;
}