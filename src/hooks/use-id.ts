import { root_stack } from '@/utils/create-root';
export default function useId() {
  const root = root_stack.at(-1);
  return root?.id();
}