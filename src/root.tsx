import {useSignal} from "./hooks"
import './root.css'

export default function Root() {

  const count = useSignal(0);

  const content = useSignal('name');
  const list = useSignal([
    {
      id: crypto.randomUUID(),
      name: 'title',
    },
    {
      id: crypto.randomUUID(),
      name: 'title',
    }
  ]);
  const data = useSignal({
    name: {
      title: 'title',
    },
    list: [
      {
        title: 'list-title'
      }
    ]
  });

  const onclick = () => {
    count.value++;
    console.log(count.value);

  }

  const onchange = (event) => {
    content.value = event.target.value;
  }

  const onreset = () => {
    content.value = 'name'
  };

  const onpush = () => {
    list.value.push({
      id: crypto.randomUUID(),
      name: 'push',
    });
    console.log(list.value)
  }


  return (
    <div id="root">
      <div class="element-box">
        <input on:input={onchange} value={content.value}/>
        <span>{content.value}</span>
        {
          list.value.map(item => <div use:key={item.id}>{item.name}{count.value}</div>)
        }
      </div>
      <div class="button-box">
        <button on:click={onclick}>count: {count.value}</button>
        <button on:click={onpush}>push</button>
        <button on:click={() => list.value.pop()}>pop</button>
        <button on:click={onreset}>
          重置
        </button>
      </div>
    </div>
  )
}