async function asyncMap(array, asyncCallback, debounceTime = 0) {
    const results = [];
    for (let i = 0; i < array.length; i++) {
        const result = await asyncCallback(array[i], i, array);
        results.push(result);
    }
    return results;
}

