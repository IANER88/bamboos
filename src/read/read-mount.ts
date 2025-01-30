import { mount_stack } from "@/seeders/on-mount";

export default function readMount(){
  const mount = mount_stack.at(-1);
  if (!mount) return; 
  const mounted = (fn) => {
    fn.mount();
    if (!fn.next) return;
    mounted(fn.next)
  }
  mounted(mount);
  mount_stack.length = 0;
}