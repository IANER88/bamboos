import { useRecrudescence, useSignal } from './hooks';
import './root.css';
import { onMount } from './seeders';

function About() {

  onMount(() => {
    console.log(document.querySelector('#about'));
  });

  return (
    <main id="about">
      about
    </main>
  )
}

function Solid() {

  
  onMount(() => {
    console.log(document.querySelector('#solid'), 1);
  });

  onMount(() => {
    console.log(document.querySelector('#solid'), 2);
  });

  return (
    <main id="solid">
      solid
    </main>
  )
}

export default function Root() {

  const count = useSignal(0);

  const name = useSignal('reset');

  const show = useSignal(false);

  useRecrudescence(() => {
    console.log(show.value);

  });
  

  return (
    <div class="root">
      <input
        type="text"
        on:input={(event) => name.value = event.target.value}
        use:value={name.value}
      />
      <div>{name.value}</div>
      {show.value ? <About /> : <Solid />}
      <div>
        <button
          type="button"
          on:click={() => count.value++}
        >
          count: {count.value}
        </button>
        <button
          type="button"
          on:click={() => show.value = !show.value}
        >
          show
        </button>
      </div>
    </div>
  )
}