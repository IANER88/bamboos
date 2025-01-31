
export type ReadDisentangle = () => void;

export type CLERN = {
  effect: ReadDisentangle;
  next: null | CLERN;
}

export const disentangle_stack: CLERN[] = [];

/**
 * @function onDisentangle
 * unload
 */
export default function onDisentangle(disentangle: ReadDisentangle) {

  const clean = {
    effect: disentangle,
    next: null,
  }

  const read = disentangle_stack.at(-1);

  if (!read) {
    disentangle_stack.push(clean)
    return;
  }
  if (!read.next) {
    read.next = clean;
    return;
  }

  let last = read;
  while (last.next) {
    last = last.next;
  }
  last.next = clean;

}