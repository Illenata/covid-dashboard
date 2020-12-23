const Observable = {
  observers: [],

  subscribe(f) {
    this.observers.push(f);
  },

  notify(state, value, time) {
    for (let index = 0; index < this.observers.length; index += 1) {
      this.observers[index].update(state, value, time);
    }
  },
};

export default Observable;
