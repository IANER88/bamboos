import { useSignal } from "./hooks"
import './root.css'
export default function Root() {

  const count = useSignal(0);

  const onclick = () => {
    count.value++
  }

  return (
    <div id="root">
      <button on:click={onclick}>
        const: {count.value}
      </button>
    </div>
  )
}