export interface PriorityQueueItem<T> {
  value: T
  priority: number
}

export class PriorityQueue<T> {
  private items: PriorityQueueItem<T>[] = []

  enqueue(value: T, priority: number): void {
    const newItem: PriorityQueueItem<T> = { value, priority }

    for (const [i, item] of this.items.entries()) {
      if (item.priority > priority) {
        this.items.splice(i, 0, newItem)
        return
      }
    }
    this.items.push(newItem)
  }

  dequeue(): T | undefined {
    return this.items.shift()?.value
  }

  peek(): T | undefined {
    return this.items[0]?.value
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }

  size(): number {
    return this.items.length
  }
}
