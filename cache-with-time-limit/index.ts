interface entry {
    value: number;
    timer : ReturnType<typeof setTimeout>
}

class TimeLimitedCache {

    cache: Map<number, entry>

    constructor (){
        this.cache = new Map<number, entry>();
    }
        
    set(key: number, value: number, duration: number): boolean {
        const exists = this.cache.has(key); 
        if (exists) clearTimeout(this.cache.get(key)!.timer);
        this.cache.set(key, {
            value: value,
            timer: setTimeout(()=> this.cache.delete(key), duration),
        })
        return exists;
    }
    
    get(key: number): number {
        return this.cache.has(key) ? this.cache.get(key)!.value : -1;
    }
    
    count(): number {
        return this.cache.size;
    }
}

/**
 * const timeLimitedCache = new TimeLimitedCache()
 * timeLimitedCache.set(1, 42, 1000); // false
 * timeLimitedCache.get(1) // 42
 * timeLimitedCache.count() // 1
 */