
export default function onLive(stack){
  const live = stack.at(-1);
  if (!live) return; 
  const mounted = (fn) => {
    fn.effect();
    if (!fn.next) return;
    mounted(fn.next)
  }
  mounted(live);
  stack.length = 0;
}