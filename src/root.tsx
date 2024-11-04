import { useDisentangle, useId, useMount, useSignal } from "./hooks"
import './root.css'
export default function Root() {

  return (
    <About />
  )
}

function About() {
  useMount(() => {
    console.log('挂载about');
  })
  useDisentangle(() => {
    console.log('卸载about');

  })

  const count = useSignal(0);
  const table = useSignal([
    {
      id: crypto.randomUUID(),
      name: 1
    }
  ])
  const show = useSignal(false);

  const input = useSignal('input')

  return (
    <div>
      <Home value={count.value} count="11">
        {count.value}
        <div>
          {
            table.map((item) => <div use:key={item.id} id={count.value}>1</div>)
          }
        </div>
      </Home>
      <div>
        {
          show.value ?
            table.map((item) => <div use:key={item.id}>1</div>)
            : input.value
        }
      </div>
      <input on:input={(event) => input.value = event.target.value} value={input.value} />
      <div style={{
        display: 'flex',
        gap: '20px',
      }}>
        <button on:click={() => count.value++}>{count.value}</button>
        <button on:click={() => show.value = !show.value}>show</button>
        <button on:click={() => table.value.pop()}>pop</button>
        <button on:click={() => table.value.push({
          id: crypto.randomUUID(),
          name: 1,
        })}>push</button>
      </div>
    </div >
  )
}

function Home(props) {

  const id = useId();
  useMount(() => {
    console.log('挂载home');
    console.log(document.querySelector(`.${id}`));
  })

  useDisentangle(() => {
    console.log('卸载home');
  });


  return (
    <div id="home" class={id}>{props?.value}{props?.children}</div>
  )
}
