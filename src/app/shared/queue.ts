class Queue {
  items: any;
  length: number;

  constructor(element) {
    if (element instanceof Array) {
      this.items = element;
    } else {
      this.items = [];
    }
    this.length = this.items.length;
  }

  //add element to queue
  enqueue(element) {
    this.length += 1;
    return this.items.push(element);
  }

  //remove element from queue
  dequeue() {
    if (this.length > 0) {
      this.length -= 1;
    }
    return this.items.shift();
  }
}

export default Queue;
