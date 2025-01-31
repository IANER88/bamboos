export type ReadMount = () => void;

type Mount = {
	effect: ReadMount,
	next: Mount | null,
}

export const mount_stack: Mount[] = [];

/**
 * @function onMount 挂載
 * @param mount
 */
export default function onMount(mount: ReadMount) {

	const hook = {
		effect: mount,
		next: null,
	}

	const read = mount_stack.at(-1);

	if (!read) {
		mount_stack.push(hook) 
		return;
	}
	if (!read.next) {
		read.next = hook;
		return;
	}

	let last = read;
	while (last.next){
		last = last.next;
	}
	last.next = hook;
}