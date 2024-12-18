
export type Disentangle = () => void;

export const disentangles: Disentangle[] = [];
/**
 * @function useDisentangle
 * unload
 */
export default function useDisentangle(disentangle: Disentangle) {
  disentangles.push(disentangle)
}