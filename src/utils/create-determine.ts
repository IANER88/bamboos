import { mount_stack } from '@/seeders/on-mount';
import { CLERN, disentangle_stack } from '@/seeders/on-disentangle';
import onLive from '@/seeders/on-live';

type Determines = {
  subscriber: null | (() => void);
}

export const determine_stack: Determines[] = [];

type IDetermine = () => undefined | null | boolean | HTMLElement | number;

interface Read {
  root: null | HTMLElement | Comment;
  disentangle: null | CLERN[];
}

export default function createDetermine(condition: IDetermine) {

  const read: Read = {
    root: null,
    disentangle: null,
  }
  const readDetermine = () => {

    let content: ReturnType<IDetermine> | Read['root'] = condition();
    const test = [false, void 0, null, 0];
        
    if (test.includes(content)){
      content = document.createComment('determine');
    }
    // const text = ['string', 'number'];
    // if (text.includes(typeof content)){
    //   const node = document.createTextNode(content);
    //   read.root?.replaceWith(node);
    //   read.root = node;
    // }
    if (read.root) {
      // 執行卸載

      
      if (read.disentangle) {
        onLive(read.disentangle);
        read.disentangle = null;
      }
      read.root?.replaceWith(content);
      onLive(mount_stack);
    }

    if (disentangle_stack.length) {
      read.disentangle = [...disentangle_stack];
      disentangle_stack.length = 0;
    }
    
    read.root = content;
    return read.root;
  }

  const execute = () => {
    determine_stack.push(executes);
    try {
      executes.subscriber = readDetermine;

      return executes.subscriber();
    } finally {
      determine_stack.pop();
    }
  }

  const executes: Determines = {
    subscriber: null,
  }

  return execute();
}