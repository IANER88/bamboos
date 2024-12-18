import SignalRoot from "@/signal/signal-root";
import { JSX } from "@/types/jsx-runtime";

export type Program = () => HTMLElement | JSX.Element;

export const root_stack: SignalRoot[] = [];

export default function createRoot(program: Program) {
  const root = new SignalRoot(program);
  
  root_stack.push(root);
  return root;
}