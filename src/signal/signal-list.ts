
export default class SignalList extends Array {
  constructor(initialState) {
    super(...initialState);
  }

  get root(){
    return this;
  }
}