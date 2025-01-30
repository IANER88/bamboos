export type ReadMount = () => void;

type Mount = {
	mount: ReadMount,
	next: Mount | null,
}

export const mount_stack: Mount[] = [];

/**
 * @function onMount 挂載
 * @param mount
 */
export default function onMount(mount: ReadMount) {

	const hook = {
		mount,
		next: null,
	}

	const read = mount_stack.at(-1);
	if (read) {
		read.next = hook
	} else {
		mount_stack.push(hook);
	}
}