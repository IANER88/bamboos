import { mount_stack } from '@/seeders/on-mount';
import {  component_stack } from './create-component'
import { readMount } from '@/read';

type Determines = {
  subscriber: null | (() => void);
}

export const determine_stack: Determines[] = [];

type IDetermine = () => void | null | boolean | HTMLElement | number;

interface Read {
  root: null | HTMLElement | Comment;
  mount: Set<IMount>;
}

export default function createDetermine(condition: IDetermine) {

  const read: Read = {
    root: null,
  }
  const readDetermine = () => {

    const content = condition();
    const test = [false, void 0, null, 0];

    if (content instanceof HTMLElement) {
      read.root?.replaceWith(content);
      if (read.root) {
        readMount();
      }
      read.root = content;
    }

    // if (test.includes(content)){
    //   const node = document.createComment('determine');
    //   read.root?.replaceWith(node);
    //   read.root = node;
    // }
    // const text = ['string', 'number'];
    // if (text.includes(typeof content)){
    //   const node = document.createTextNode(content);
    //   read.root?.replaceWith(node);
    //   read.root = node;
    // }

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