export type IMount = () => void;
export const mounts: IMount[] = [];

/**
 * @function useMount 挂載
 * @param mount
 */
export default function useMount(mount: IMount) {
	mounts.push(mount)
}