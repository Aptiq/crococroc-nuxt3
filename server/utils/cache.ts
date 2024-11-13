type CacheValue = {
  value: any
  expiry: number
}

class Cache {
  private store = new Map<string, CacheValue>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes

  async get(key: string): Promise<any | null> {
    const item = this.store.get(key)
    if (!item) return null
    if (Date.now() > item.expiry) {
      this.store.delete(key)
      return null
    }
    return item.value
  }

  async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
    this.store.set(key, {
      value,
      expiry: Date.now() + ttl
    })
  }

  async invalidate(key: string): Promise<void> {
    this.store.delete(key)
  }
}

export const cache = new Cache() 