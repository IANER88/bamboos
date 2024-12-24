type IEvent = [string, () => () => unknown]

export default function createEvent(this: Element, listener: IEvent) {
  
  const [name, event] = listener;
  
  const type = name.split('-').join('');

  this.addEventListener(type, event())
}