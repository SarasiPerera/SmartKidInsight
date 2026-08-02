import { OfflineQueueItem } from "../types";

const QUEUE_STORAGE_KEY = "smartkid_offline_queue";

export class OfflineQueue {
  private static getQueue(): OfflineQueueItem[] {
    try {
      const data = localStorage.getItem(QUEUE_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private static saveQueue(items: OfflineQueueItem[]): void {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Could not save to offline queue localStorage", e);
    }
  }

  public static enqueue(type: "response" | "session", payload: any): void {
    const items = this.getQueue();
    const newItem: OfflineQueueItem = {
      id: "off_" + Math.random().toString(36).substring(2, 9),
      type,
      payload,
      created_at: Date.now(),
    };
    items.push(newItem);
    this.saveQueue(items);
  }

  public static getPendingCount(): number {
    return this.getQueue().length;
  }

  public static async drainQueue(
    syncCallback: (item: OfflineQueueItem) => Promise<boolean>
  ): Promise<number> {
    const items = this.getQueue();
    if (items.length === 0) return 0;

    const remaining: OfflineQueueItem[] = [];
    let processedCount = 0;

    for (const item of items) {
      try {
        const success = await syncCallback(item);
        if (success) {
          processedCount++;
        } else {
          remaining.push(item);
        }
      } catch {
        remaining.push(item);
      }
    }

    this.saveQueue(remaining);
    return processedCount;
  }
}
