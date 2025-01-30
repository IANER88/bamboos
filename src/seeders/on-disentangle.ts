
export type ReadDisentangle = () => void;

export const disentangle_stack: ReadDisentangle[] = [];
/**
 * @function useDisentangle
 * unload
 */
export default function onDisentangle(disentangle: ReadDisentangle) {

  const clean = {
    disentangle,
    next: null,
  }

  const read = disentangle_stack.at(-1);

  if (read) {
    read.next = clean
  } else {

    disentangle_stack.push(clean);
  }
}