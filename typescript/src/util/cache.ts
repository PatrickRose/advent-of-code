export function getValueFromCache<Key, Value>(cacheKey: Key, callback: () => Value, cache: Map<Key, Value>): Value {
    const cacheVal = cache.get(cacheKey);
    if (cacheVal !== undefined) {
        return cacheVal;
    }

    const toSet = callback();
    cache.set(cacheKey, toSet);

    return toSet;
}
